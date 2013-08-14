var Blog = require('./../lib/blog.js')
  , Tuts = require('./../lib/tuts.js')
  , Labs = require('./../lib/labs.js');

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
                res.render('index', { title: 'The Mind Company', last_blog: blog, 
                                      last_tut: tut, last_lab: lab });
              }
            });
          }
        });
    }
  });
};

exports.blog = function(req, res){
  res.render('blog', { title: 'The Mind Company | Blog' });
};

exports.tuts = function(req, res){
  res.render('tuts', { title: 'The Mind Company | Tutorials' });
};

exports.labs = function(req, res){
  res.render('labs', { title: 'The Mind Company | Labratory' });
};
