// server.js
// where your node app starts

// init project
var express = require('express');
var cookieParser = require('cookie-parser')
var fs = require('fs');
var hbs = require('hbs');
var os = require('os');
var request = require('request');

var app = express();

app.locals.ga_id = process.env.GA_ID || '';
app.locals.gmaps_id = process.env.GMAPS_ID || '';

app.enable('trust proxy');
app.set('view engine', 'hbs');
app.set('views', './templates')
app.use(express.static('public'));
app.use(cookieParser())

hbs.registerPartial("above", fs.readFileSync("./partials/above.hbs", "utf-8"));
hbs.registerPartial("below", fs.readFileSync("./partials/below.hbs", "utf-8"));

hbs.registerHelper('isUrl', function(url, options) { return this.url == url || this.url.startsWith(url + "?") ? options.fn(this) : '';});
hbs.registerHelper('isParam', function(param, value, options) { return options.data.root[param] == value ? options.fn(this) : options.inverse(this);});

function getStatus() {
	var retVal = {}

	retVal["success"] = true;
	retVal["message"] = "OK";
	retVal["timestamp"] = new Date().toISOString();
	retVal["__dirname"] = __dirname;
	retVal["__filename"] = __filename;
	retVal["os.hostname"] = os.hostname();
	retVal["os.type"] = os.type();
	retVal["os.platform"] = os.platform();
	retVal["os.arch"] = os.arch();
	retVal["os.release"] = os.release();
	retVal["os.uptime"] = os.uptime();
	retVal["os.loadavg"] = os.loadavg();
	retVal["os.totalmem"] = os.totalmem();
	retVal["os.freemem"] = os.freemem();
	retVal["os.cpus.length"] = os.cpus().length;
	// too much junk: retVal["os.networkInterfaces"] = os.networkInterfaces();
	
	retVal["process.arch"] = process.arch;
	retVal["process.cwd"] = process.cwd();
	retVal["process.execPath"] = process.execPath;
	retVal["process.memoryUsage"] = process.memoryUsage();
	retVal["process.platform"] = process.platform;
	retVal["process.release"] = process.release;
  retVal["process.title"] = process.title;
	retVal["process.uptime"] = process.uptime;
	retVal["process.version"] = process.version;
	retVal["process.versions"] = process.versions;
	retVal["process.installPrefix"] = process.installPrefix;
	
	return retVal;
}

app.get('/status.json', function(req, res) {
  res.writeHead(200, {
        "Content-Type": "text/plain",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Max-Age': '604800',
      });

  sendJson(req, res, getStatus());
  return;
});

function sendJson(req, res, jsonObj) {
	if ('callback' in req.query)
	{
		res.write(req.query["callback"]);
		res.write("(");
		res.write(JSON.stringify(jsonObj));
		res.write(");");
	}
	else
	{
		res.write(JSON.stringify(jsonObj));
	}
  res.end();
}

function trackEvent(req, event) {
  var fields = {};
  fields.v = '1';
  fields.tid = process.env.GA_ID;
  fields.cid = '';    // anonymous client id
  fields.t = 'event';
  fields.ec = event.eventCategory;
  fields.ea = event.eventAction;
  fields.el = event.eventLabel;
  fields.ev = event.eventValue;
  fields.ua = req.get('user-agent') || '(not set)';
  fields.uip = req.ip || null;
  
  var formData = {};
  formData.v = '1';
  formData.tid = process.env.GA_ID;
  formData.cid = '';    // anonymous client id
  formData.t = 'event';
  if (event.eventCategory) { formData.ec = event.eventCategory; }
  if (event.eventAction) { formData.ea = event.eventAction; }
  if (event.eventLabel) { formData.el = event.eventLabel; }
  if (event.eventValue) { formData.ev = event.eventValue; }
  formData.ua = req.get('user-agent') || '(not set)';
  formData.uip = req.ip || '0.0.0.0';
  
  request.post({
    url: "https://www.google-analytics.com/collect",
    formData: formData
  }, function (error, response, body){
    console.log("INFO: ga tracking returned " + response.statusCode);
  });
}

function is_valid_clock(clock_id) {
  if (clock_id == null || clock_id == "") {
    return false
  }
  //LATER: if clock matches a-z0-9-
  //LATER: if clock exists in fs
  return true;
}

function load_clock(clock_id) {
    var clock = null;
  
    if (clock_id != null) {
      try {
        var clockStr = fs.readFileSync("clocks/system/" + clock_id + ".json", {"encoding": "utf-8"});
        clock = JSON.parse(clockStr);
      }
      catch (e) {
        console.log("ERROR: " + e + " (" + clock_id + ")");
      }
    }
    return clock;
}

function load_style(style_id) {
  
    if (style_id == null) {
      return null;
    }
  
    try {
      var styleStr = fs.readFileSync("clocks/styles/" + style_id + ".json", {"encoding": "utf-8"});
      var style = JSON.parse(styleStr);
    }
    catch (e) {
      console.log("ERROR: " + e + " (" + style_id + ")");
    }
    return style;
}

function redirect_to_default(req, res) {
  var cookie_clock_id = req.cookies.clock;
  if (!is_valid_clock(cookie_clock_id)) {
    cookie_clock_id = 'default';
  }
  var url = "?clock=" + cookie_clock_id;
  if (req.query.scale != null) {
    url += "&scale=" + req.query.scale;
  }
  res.redirect(url);
}

app.get([ '/', '/index.html'], function(req, res) {
  console.log(req.originalUrl + " " + JSON.stringify(req.query));
  
  if (req.query['clock'] == null) {
    redirect_to_default(req, res);
    return;
  }
  
  var clock_id = req.query["clock"];
  if (is_valid_clock(clock_id) == false) {
    redirect_to_default(req, res);
    return;
  }
  
  var clock = load_clock(clock_id);
  if (clock == null) {
    redirect_to_default(req, res);
    return;
  }
  
  var userAgent = req.get('user-agent');
  var highres = (req.query.highres && (req.query.highres == "true" || req.query.highres == "1")) ? true : false;
  
  var scale = req.query.scale;
  if (scale == null) {
    scale = req.cookies.scale;
  }
  if (scale == null) {
    scale = "1";
  }
  
  res.cookie("clock", clock_id);
  res.cookie("scale", scale);
  res.render("clock.hbs", { "clock": JSON.stringify(clock), "style": JSON.stringify(load_style(clock.style)), "scale": scale });
  return;
});

app.get('/logo-tmp.html', function(req, res) {
  
  var clock = load_clock("logo");
  
  var scale = "1";
  
  res.render("logo-tmp.hbs", { "clock": JSON.stringify(clock), "style": JSON.stringify(load_style(clock.style)), "scale": scale });
  return;
}); 

app.get('/clocks.json', function(req, res) {
  var result = {};
  
  var clocks = [];
  
  var showBeta = req.query.beta == 'true';
  
  fs.readdirSync("./clocks/system/").forEach(file => {
    if (file.endsWith(".json")) {
      var clock_id = file.slice(0, -5);
      var clock = load_clock(clock_id);
      if (clock == null) {
        return;
      }
      
      var title = clock.title;
      if (clock.beta) {
        if (showBeta == false) {
          return;
        }
        else {
          title += " (beta)";
        }
      }
      
      clocks.push({"id": clock_id, "description": title, "title": title});
    }
  });
  result["success"] = true;
  result["message"] = clocks.length + " clocks loaded";
  result["code"] = 0;
  result["clocks"] = clocks;

  trackEvent(req, { eventCategory: 'API', eventAction: 'clocks.json'});
  sendJson(req, res, result);
  return;
});

app.get('/picker.html', function(req, res) {
  var clocks = [];
  
  fs.readdirSync("./clocks/system/").forEach(file => {
    if (file.endsWith(".json")) {
      var clock_id = file.slice(0, -5);
      var clock = load_clock(clock_id);
      if (clock == null) {
        return;
      }
      
      if (clock.beta && !req.query["beta"]) {
        return;
      }
      
      //clocks.push({"id": clock_id, "title": clock.title });
      clocks.push(clock);
    }
  }); 
  res.render("picker", { "title": "Select a Clock", "clocks": clocks, "url": req.originalUrl, "current": req.query["clock"] });
  return; 
});
 
app.get(['/support', '/support/', '/support/index.html'], function(req, res) {
  res.redirect('/support/faq.html');
  return;
});

var viewport_tests = {
  "1920_half": "width=1920, initial-scale=0.5",  // std
  "1920": "width=1920",  // std
  "dw_one_s2f_n": "width=device-width, initial-scale=1, shrink-to-fit=no",  // big but offscreen
  "dw_half_s2f_y": "width=device-width, initial-scale=0.5, shrink-to-fit=yes",
  "dw_half_s2f_y_hdpi": "width=device-width, initial-scale=0.5, shrink-to-fit=yes, target-densitydpi=hdpi",
  "1920_half_s2f_y_hdpi": "width=1920, initial-scale=0.5, shrink-to-fit=yes, target-densitydpi=hdpi",
  "hdpi": "target-densitydpi=hdpi"
};

app.get('/tests/:viewport.html', function(req, res) {
  console.log("viewport test", req.params);
  res.render("viewport-test", { "title": "Viewport Test", "viewport": viewport_tests[req.params.viewport] });

});

app.get('/support/bounds.html', function(req, res) {
  
  res.render("bounds", {});
  return;
});


app.get('/support/faq.html', function(req, res) {
  
  res.render("faq", { "title": "FAQ", "url": req.originalUrl, "ip": req.ip, "user_agent": req.get("user-agent"), "x_forwarded_for": req.get("x-forwarded-for"), "tests": Object.keys(viewport_tests) });
  return;
});

app.get('/support/about.html', function(req, res) {
  res.render("about", { "title": "About", "url": req.originalUrl});
  return;
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});
