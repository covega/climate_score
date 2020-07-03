console.log("running");
var width = 960,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Can we use this data? Snagged from mbostocks site, looks like it's open source.
// We should host it on webiste and make an async request instead of bloating the whole site.
// We need to host this data and run a server instead of the software crime I commit below. Then,
// make that function a callback with the following signature:
// 
// function ready(error, us, congress)
// 
// and call the below:
// 
// queue()
//     .defer(d3.json, "http://source-of-data/us.json")
//     .defer(d3.json, "http://source-of-data/us-congress-113.json")
//     .await(ready);


// vars "us" and "congress" are hoisted from the imports in head of index.html. This is terrible practice.

svg.append("defs").append("path")
  .attr("id", "land")
  .datum(topojson.feature(us, us.objects.land))
  .attr("d", path);

svg.append("clipPath")
  .attr("id", "clip-land")
.append("use")
  .attr("xlink:href", "#land");

svg.append("g")
  .attr("class", "districts")
  .attr("clip-path", "url(#clip-land)")
.selectAll("path")
  .data(topojson.feature(congress, congress.objects.districts).features)
.enter().append("path")
  .attr("d", path).attr("class", "district")
.append("title")
  .text(function(d) { return d.id; });

svg.append("path")
  .attr("class", "district-boundaries")
  .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
  .attr("d", path);

svg.append("path")
  .attr("class", "state-boundaries")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("d", path);

d3.select(self.frameElement).style("height", height + "px");

// Maybe we should be using display: none? https://www.w3schools.com/css/css_display_visibility.asp
// Register this as an onclick for any of the districts
function OnClickDistrict() {
  // TODO - make this populate with per district info instead of generic
  var card = document.getElementById("floating-card");
  // This just toggles - we really want each district to be tied to a particular card. Maybe we can
  // generate all cards on a per district basis, have this function turn every other cards visibility off
  // and a specific cards visibility on?
  console.log(card.style);
  if (card.style.visibility == "visible") {
    card.style.visibility='hidden';
  } else {
    card.style.visibility='visible';
  }
}

// Get all districts with class ".district" and register this onclick
var districts = document.getElementsByClassName("district");
for (var i = 0; i < districts.length; ++i) {
  district = districts[i];
  district.onclick = function() {OnClickDistrict()};
}
