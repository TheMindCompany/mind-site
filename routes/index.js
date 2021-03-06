var Blog = require('./../lib/blog.js')
  , Tuts = require('./../lib/tuts.js')
  , Labs = require('./../lib/labs.js')
  , Navi = require('./../lib/nav.js')
  , Auth = require('./../lib/auth.js')
  , Email = require('./../lib/email.js');

function toDate( date ) {
  var newvar;
  newvar = date.toString();
  date = newvar.split(' ');
  date = date.splice(1,3).join(' ');
  return date;
}

exports.email = function(req, res){
  Email.mail(req.body.email, req.body.name, req.body.subject, req.body.message, function (err){
    if (err) {
      console.log(err);
    } else {
      console.log("Email sucessfully sent.");
      res.redirect('/#contact');
    }
  });
};

exports.index = function(req, res){
  Blog.lastEntry(function (err, blog){
    if (err) {
      console.log(err);
    } else if (blog) {
        Tuts.lastEntry(function (err, tut){
          if (err) {
            console.log(err);
          } else if (tut) {
            Labs.lastEntry(function (err, lab){
              if (err) {
                console.log(err);
              } else if (lab) {
                Navi.navList('home', function(err, navItem){
                  if (err){
                    console.log(err);
                  } else {
                    res.render('index', { title: 'The Mind Company', navi: navItem, last_blog: blog, last_tut: tut, last_lab: lab });
                  }
                });
              }
            });
          }
        });
    }
  });
};

exports.blog = function(req, res){
  // console.log(req.session);
  Blog.blog(function (err, entry){
    if (err) {
      console.log(err);
    } else if (entry) {
      for (each in entry) {
        entry[each].written = toDate(entry[each].written_on);
      }
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {                  
          res.render('blog', { title: 'The Mind Company | Blog', navi: navItem, blog: entry});  
        }       
      });
    }
  });
};

exports.blogID = function(req, res){
  Blog.blog(function (err, blogs){
    if (err) {
      console.log(err);
    } else if (blogs) {
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {
          var entry;
          for (post in blogs) {
            if (blogs[post].html == req.param('htmlID')) {
              entry = blogs[post];              
              entry.written = toDate(blogs[post].written_on);
              blogs.splice(post, 1);
            }
          }
          res.render('blogID', { title: 'Blog | ' + entry.title, navi: navItem, blog: entry, blog_entries: blogs });
        }
      });
    }  
  });
};

exports.tuts = function(req, res){
  Tuts.tuts(function (err, entry){
    if (err) {
      console.log(err);
    } else if (entry) {
      for (each in entry) {
        entry[each].written = toDate(entry[each].written_on);
      }
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {
          res.render('tuts', { title: 'The Mind Company | Tutorials', navi: navItem, tuts: entry });
        }
      });
    }
  });
};

exports.tutsID = function(req, res){
  Tuts.tuts(function (err, tuts){
    if (err) {
      console.log(err);
    } else if (tuts) {
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {
          var entry;
          for (post in tuts) {
            if (tuts[post].html == req.param('htmlID')) {
              entry = tuts[post];
              entry.written = toDate(tuts[post].written_on);
              tuts.splice(post, 1);
            }
          }
          res.render('tutsID', { title: 'Tutorial | ' + entry.title, navi: navItem, tut: entry, tut_entries: tuts });
        }
      });
    }  
  });
};

exports.labs = function(req, res){
  Labs.labs(function (err, entry){
    if (err) {
      console.log(err);
    } else if (entry) {
      for (each in entry) {
        entry[each].written = toDate(entry[each].written_on);
      }
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {
          res.render('labs', { title: 'The Mind Company | laboratory', navi: navItem, labs: entry });
        }
      });
    }
  });
};

exports.labsID = function(req, res){
  Labs.labs(function (err, labs){
    if (err) {
      console.log(err);
    } else if (labs) {
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {
          var entry;
          for (post in labs) {
            if (labs[post].html == req.param('htmlID')) {
              entry = labs[post];
              entry.written = toDate(labs[post].written_on);
              labs.splice(post, 1);
            }
          }
          res.render('labsID', { title: 'Laboratory | ' + entry.title, navi: navItem, lab: entry, lab_entries: labs });
        }
      });
    }  
  });
};
