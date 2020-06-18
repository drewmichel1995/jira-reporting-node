var https = require('https');
//var rootCas = require('ssl-root-cas').create();
//rootCas.addFile('/server/certs/devops.saicwebhost.net.chained.crt');
// default for all https requests
// (whether using https directly, request, or another module)
//require('https').globalAgent.options.ca = rootCas;

const moment = require('moment');


const getWeeklyReport = () => {
    return new Promise((resolve, reject) => { 
        var filter = ' AND (issuetype="new feature" OR issuetype=improvement OR issuetype=bug) AND Sprint in openSprints()';
        var projects = ["DETX", "DEXARCH", "DEWORK", "DETWN", "DEONT"];
        getIssueData(projects, filter).then(response => { 
          filter = ' AND status="In Progress"';
          projects = ["DEMGT", "DEINFRA"];
         getIssueData(projects, filter).then(response2 => {
           response2.map(r => {
             response.push(r);
           })

           filter = ' AND issuetype=epic AND (labels="Pre-B%26P" OR labels="Direct" OR labels = "B%26P") AND status="In Progress"';
           projects = ["DEDEL"];
           getEpicData(projects, filter).then(response3 => {
            response3.map(r => {
              response.push(r);
            })
              executePost(generateReport(response)).then(response4 => {
                try {
                    const parsedData = response4;
                    resolve(parsedData);
                  } catch (e) {
                    reject(e.message);
                  }

              })

            }).catch(error => {
              console.log(error);
            });
         }).catch(error => {
           console.log(error);
         });

        }).catch(error => {
          console.log(error);
        });
    });
}

function getIssueData(projects, filter){
  return new Promise((resolve, reject) => { 
    getProjects(projects, filter).then(response => {
      var total = 0;
      var count = 0;
      for(var i = 0; i < response.length; i++) {
        var temp = response[i].issues.length;
        total = total + temp;
       
      }
      response.map((r,j) => {
        r.issues.map((issue, k) => {
          var path = '/rest/api/latest/issue/' + issue.key + '?fields=comment,summary,status,assignee';
          var comments = [];
          count++;
          executeGet(path).then(response2 => {
            
            issue.summary = response2.fields.summary;
            issue.status = response2.fields.status.name;
            response2.fields.assignee != null ? issue.assignee = response2.fields.assignee.displayName : issue.assignee = "Unassigned";
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

function getEpicData(projects, filter){
  return new Promise((resolve, reject) => {
    getProjects(projects, filter).then(response => {
      var total = 0;
      var count = 0;
      for(var i = 0; i < response.length; i++) {
        var temp = response[i].issues.length;
        total = total + temp;
      }
      response.map((r,j) => {
        r.issues.map((issue, k) => {
          var path = '/rest/api/latest/search?fields=comment,summary,status,assignee&jql=project=DEDEL AND "Epic Link" = ' + issue.key;
          issue.issues = [];
          count++;
          executeGet(path).then(response2 => {
            response2.issues.map(i => {
              var tempIssue = {};
              tempIssue.key = i.key;
              tempIssue.summary = i.fields.summary;
              tempIssue.status = i.fields.status.name;
              i.fields.assignee != null ? tempIssue.assignee = i.fields.assignee.displayName : tempIssue.assignee = "Unassigned";
              var tempDate = new Date("1980-01-01T13:38:34.206-0500");
              if(i.fields.comment != null){
                i.fields.comment.comments.map((c) => {
                  var comment = {};
                  var cmpDate = new Date(c.updated)
                  if(cmpDate.getTime() > tempDate.getTime()){
                    tempDate = cmpDate;
                    comment.author = c.author.displayName;
                    comment.body = c.body;
                    comment.posted = c.updated;
                    tempIssue.comment = comment;
                  }
                })
              }
              
              issue.issues.push(tempIssue);
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
      var fields = 'fields=key,project,summary'
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
              proj.issues.push({"key": issue.key, "summary": issue.fields.summary});
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
  
  var options = {
    hostname: process.env.JIRA_URL,
    path: encodeURI(path),
    port: 443,
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + process.env.AUTH_STRING
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

function escapeComment(comment){
  comment = comment.replace("&", "and");
  return comment.replace(/[^a-z0-9,!.@#$%^&*:/() +]+/gi, "");
}

function escapeHTML(html){
  html = html.replace(/&/g, '&amp;');
  html = html.replace(/&amp;mdash;/g, "&mdash;");
  return html.replace(/[\u0001\u0019]/g,'');
}

function executePost(html){
  var start = moment().subtract(1, 'weeks').startOf('week').format('MM/DD/YYYY');

  var body = {};
  body.space = {};
  body.body = {};
  body.body.storage = {};
  body.type = "page";
  body.title = process.env.REPORT_TITLE + start.toString();
  body.space.key = process.env.CONFLUENCE_SPACE_KEY;
  body.ancestors = [{"id": process.env.PAGE_TREE_PAGE_ID}]
  body.body.storage.value = escapeHTML(html);
  body.body.storage.representation = "storage";
  let encodedData = JSON.stringify(body);

  var options = {
    hostname: process.env.CONFLUENCE_URL,
    path: encodeURI("/rest/api/content/"),
    port: 443,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + process.env.AUTH_STRING,
      'Content-Type': 'application/json',
      'Content-Length': encodedData.length
   } 
  };
  
  return new Promise((resolve, reject) => {

    callback = function(res) {
      let data = ''
      res.on('data', (d) => {
        data += d;
      });

      res.on('end', () => {
        try {
          const parsedData = res.statusCode;
          if(parsedData != 200){
            console.log("Error Posting Report on " + start.toString());
          }else{
            console.log("Report Successfully Posted on " + start.toString());
          }
          
          resolve(parsedData);
        } catch (e) {
          reject(e.message);
        }
      });
    }

    var req = https.request(options, callback);

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(encodedData);
    req.end();

  });
}

function generateReport(data){
  var start = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
  
  var html = "<ul style='list-style-type:none;'>";
  data.map(d => {
    if(d.key === "DEDEL"){
      html += getDEDELHTML(d);
    }else{
      html += "<li><h2><a target='_blank' href='" + process.env.JIRA_URL + "/browse/" + d.key + "'><b>" + d.key + "</b>: " + d.name + "</a></h2><ul style='list-style-type:none;'>";
      d.issues.map(i => {
        html += "<li>" + "<a target='_blank' href='" + process.env.JIRA_URL + "/browse/" + i.key + "'><b>" + i.key + "</b>: " + i.summary + "</a><ul style='list-style-type:none;'>";
        html+= "<li><b>Assignee</b>: " + i.assignee + " &mdash; <b>Status</b>: " + i.status + "</li>"
        if(i.comment != null){
          
          if(moment(i.comment.posted).isAfter(start)){
           html+= "<li><ac:emoticon ac:name='tick' /><b> Last Comment Date</b>: " + moment(i.comment.posted).format("dddd, MMMM Do YYYY, h:mm:ss a") + "</li>"
            html += "<li><ac:emoticon ac:name='information' /><b> " + i.comment.author + "</b>: <blockquote><p>" + escapeComment(i.comment.body) + "</p></blockquote></li></ul></li>"
          }else{
            html += '<li><ac:emoticon ac:name="warning" /><b> Last Comment Date</b>: ' + moment(i.comment.posted).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</li>'
            html += "<li><ac:emoticon ac:name='information' /><b> " + i.comment.author + "</b>: <blockquote><p>" + escapeComment(i.comment.body) + "</p></blockquote></li></ul></li>"
          }
          
        }else{
          if(i.status === "In Progress"){
            html += "<li><ac:emoticon ac:name='warning' /><i> No Comments</i></li></ul></li>";
          }else{
            html += "<li><i>No Comments</i></li></ul></li>";
          }
        }
        html += "<br />";
      })
      html += "</ul></li>";
      }
      html += "<hr />";
  })

  html += "</ul>";
  
  return html;
}

function getDEDELHTML(data){
  var start = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
  var end = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
  var html = "<li><h2><a target='_blank' href='" + process.env.JIRA_URL + "/browse/" + data.key + "'><b>" + data.key + "</b>: " + data.name + "</a></h2><ul style='list-style-type:none;'>";
  
    data.issues.map(issue => {
      html += "<li><a target='_blank' href='" + process.env.JIRA_URL + "/browse/" + issue.key + "'><h3><b>" + issue.key + "</b>: " + issue.summary + "</h3></a><ul style='list-style-type:none;'>";
      issue.issues.map(i => {
        html += "<li><a target='_blank' href='" + process.env.JIRA_URL + "/browse/" + i.key + "'><b>" + i.key + "</b>: " + i.summary + "</a><ul style='list-style-type:none;'>";
        html+= "<li><b>Assignee</b>: " + i.assignee + " &mdash; <b>Status</b>: " + i.status + "</li>"
        if(i.comment != null){

          if(moment(i.comment.posted).isAfter(start)){
            html+= "<li><ac:emoticon ac:name='tick' /><b> Last Comment Date</b>: " + moment(i.comment.posted).format("dddd, MMMM Do YYYY, h:mm:ss a") + "</li>"
             html += "<li><ac:emoticon ac:name='information' /><b> " + i.comment.author + "</b>: <blockquote><p>" + escapeComment(i.comment.body) + "</p></blockquote></li></ul></li>"
           }else{
             html += '<li><ac:emoticon ac:name="warning" /><b> Last Comment Date</b>: ' + moment(i.comment.posted).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</li>'
             html += "<li><ac:emoticon ac:name='information' /><b> " + i.comment.author + "</b>: <blockquote><p>" + escapeComment(i.comment.body) + "</p></blockquote></li></ul></li>"
           }

        }else{
          if(i.status === "In Progress"){
            html += "<li><ac:emoticon ac:name='warning' /><i> No Comments</i></li></ul></li>";
          }else{
            html += "<li><i>No Comments</i></li></ul></li>";
          }
        }
        html += "<br />";
      })
      html += "</ul></li>";
    })
    html += "</ul></li>";


  return html;
}

module.exports.getWeeklyReport = getWeeklyReport;