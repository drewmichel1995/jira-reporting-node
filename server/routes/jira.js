var https = require('https');
var rootCas = require('ssl-root-cas/latest').create();
rootCas.addFile('/srv/app/server/certs/devops.saicwebhost.net.chained.crt');
// default for all https requests
// (whether using https directly, request, or another module)
require('https').globalAgent.options.ca = rootCas;

const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');



router.get('/', async (req, res) => {

  try {
    var filter = ' AND (issuetype="new feature" OR issuetype=improvement OR issuetype=bug)';
    var projects = ["DETX", "DEXARCH", "DEWORK", "DETWN", "DEONT"];
    getIssueData(projects, filter).then(response => {
      filter = ' AND status="In Progress"';
      projects = ["DEMGT", "DEINFRA"];
     getIssueData(projects, filter).then(response2 => {
       response2.map(r => {
         response.push(r);
       })

       filter = ' AND issuetype=epic AND (labels="Pre-B%26P" OR labels="Direct" OR labels = "B%26P")';
       projects = ["DEDEL"];
       getIssueData(projects, filter).then(response3 => {
        response3.map(r => {
          response.push(r);
        })
 //
          res.status(200).send(generateReport(response))
        }).catch(error => {
          console.log(error);
        });
     }).catch(error => {
       console.log(error);
     });
     // res.status(200).json({ message: response });
    }).catch(error => {
      console.log(error);
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function getIssueData(projects, filter){
  return new Promise((resolve, reject) => { 
    getProjects(projects, filter).then(response => {
      var total = 0;
      var count = 0;
      console.log("Number of projects: " + response.length);
      for(var i = 0; i < response.length; i++) {
        var temp = response[i].issues.length;
        total = total + temp;
        console.log("Number of Issues: " + temp);
        console.log("Total Count For Project " + i + ": " + total);
       
      }
      console.log("After Loop Total: " + total);
      console.log("<==============================>");
      response.map((r,j) => {
        r.issues.map((issue, k) => {
          var path = '/rest/api/latest/issue/' + issue.key + '?fields=comment,summary,status';
          var comments = [];
          count++;
          executeGet(path).then(response2 => {
            
            issue.summary = response2.fields.summary;
            issue.status = response2.fields.status.name;
            var tempDate = new Date("1980-01-01T13:38:34.206-0500");
            response2.fields.comment.comments.map((c) => {
              var comment = {};
              var cmpDate = new Date(c.updated)
              if(cmpDate.getTime() > tempDate.getTime()){
                tempDate = cmpDate;
                comment.author = c.author.displayName;
                comment.body = c.body;
                comment.posted = c.updated;
                issue.comment = comment;
              }
            })
            count--;
            if(count === 0){
              try {
                const parsedData = response;
                resolve(parsedData);
              } catch (e) {
                reject(e.message);
              }
            
            }
          }).catch(error => {
            console.log(error);
          });
        })
      })
    }).catch(error => {
      console.log(error);
    });
  });
}

function getProjects(projects, filter){
  var projectIssues = [];
  var projLength = 0;
  return new Promise((resolve, reject) => { 
    projects.map((p, j) => {
      var route = '/rest/api/latest/search?';
      var fields = 'fields=key,project'
      var query = '&jql=project=' + p + filter;
      var path = route + fields + query;
      projLength++;
      executeGet(path)
          .then(response => {
            var proj = {};
            proj.key = p;
            proj.issues = [];

            response.issues.map(issue => {
              proj.name = issue.fields.project.name;
              proj.issues.push({"key": issue.key});
            })
            projectIssues.push(proj);
            projLength--;
            if(projLength === 0){
              try {
                const parsedData = projectIssues;
                resolve(parsedData);
              } catch (e) {
                reject(e.message);
              }
              
            }
          })
          .catch(error => {
            console.log(error);
          });
     })
  });
}

function executeGet(path){
  var username = "michell";
  var passw = "2020-M-4-s-0-N";
  

  let str = username + ':' + passw;
  let binaryData = Buffer.from(str, "utf8");
  let base64Data = binaryData.toString("base64");

  

  var options = {
    hostname: 'jira.devops.saicwebhost.net',
    path: encodeURI(path),
    port: 443,
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + base64Data
   } 
  };
  
  return new Promise((resolve, reject) => {

    callback = function(res) {
      var { statusCode } = res;
      var contentType = res.headers['content-type'];

      let error;

      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
          `Expected application/json but received ${contentType}`);
      }

      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
      }

      res.setEncoding('utf8');
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          reject(e.message);
        }
      });
    }

    https.get(options, callback);

  });
}

function generateReport(data){
  var start = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
  var end = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
  
  var html = `<html>
                <title>temp</title>
                <style>
                .accordion > input[name="collapse"] {
                  display: none;
                }

                .accordion .content {
                  background: #fff;
                  overflow: hidden;
                  height: 0;
                  transition: 0.5s;
                  color: red;
                }

                .accordion label {
                  cursor: pointer;
                  font-weight: normal;
                }
                 
                .accordion label:hover,
                .accordion label:focus {
                  color: blue;
                }

                .accordion > input[name="collapse"]:checked ~ .content {
                  height: auto;
                  transition: height .25s ease-in-out;
                }
                
                </style>
                <body>
                  <ul style='list-style-type:none;'>`;
  data.map(d => {
    html += "<li><h2><a target='_blank' href='https://jira.devops.saicwebhost.net/browse/" + d.key + "'><strong>" + d.key + "</strong>: " + d.name + "</a></h2><ul style='list-style-type:none;'>";
    d.issues.map(i => {
      html += "<li><a target='_blank' href='https://jira.devops.saicwebhost.net/browse/" + i.key + "'><strong>" + i.key + "</strong>: " + i.summary + "</a><ul style='list-style-type:none;'>";
      html+= "<li><strong>Status</strong>: " + i.status + "</li>"
      if(i.comment != null){
        
        if(moment(i.comment.posted).isAfter(start) && moment(i.comment.posted).isBefore(end)){
          html+= "<li><strong>Last Comment Date</strong>: " + moment(i.comment.posted).format("dddd, MMMM Do YYYY, h:mm:ss a"); + "</li>";
          html += "<li><strong>" + i.comment.author + "</strong>: " + i.comment.body + "</li></ul></li></br>";
        }else{
          html += `<li><section class="accordion">
                    <input type="checkbox" name="collapse" id="` + i.key + `"/>
                    
                      
                      <label for="` + i.key + `">`
                        + '<strong>Last Comment Date</strong>: ' + moment(i.comment.posted).format("dddd, MMMM Do YYYY, h:mm:ss a") +
                      `</label>
                    
          
                    <div class="content">
                      <p><strong>`+ i.comment.author +`</strong>: ` + i.comment.body + `</p>  
                    </div>
                  </section></li>`
          html += "<li><i>No Comments from Last Week</i></li></ul></li></br>";
        }
        
      }else{
        html += "<li><i>No Comments</i></li></ul></li></br>";
      }
      
    })
    html += "</ul></body><html>";
  })
  
  return html;
}

module.exports = router;
