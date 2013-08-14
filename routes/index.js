var Blog = require('./../lib/blog.js')
  , Tuts = require('./../lib/tuts.js')
  , Labs = require('./../lib/labs.js')
  , Navi = require('./../lib/nav.js');

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
  Blog.blog(function (err, entry){
    if (err) {
      console.log(err);
    } else if (entry) {
      Navi.navList('return', function(err, navItem){
        if (err){
          console.log(err);
        } else {
          res.render('blog', { title: 'The Mind Company | Blog', navi: navItem, blog: entry });
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

exports.labs = function(req, res){
  Labs.labs(function (err, entry){
    if (err) {
      console.log(err);
    } else if (entry) {
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
