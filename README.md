Girl Develop IT Pittsburgh
====================

This site uses [Github Pages](http://pages.github.com/) and [Jekyll](https://github.com/mojombo/jekyll).

## Development quick start

### Clone and set up your environment
  There is an .rvmrc file within the project that sets your environment to use Ruby 1.9.3 with gemset girldevelopitpgh.com.  The project is using [Github Pages](http://pages.github.com/), so the site can be found in the gh-pages branch.

    $ git clone git@github.com:gdipgh/girldevelopitpgh.com.git
    $ cd girldevelopitpgh.com
    $ bundle install
    
### Start the server
  The site uses Jekyll to create pages.  To preview locally as you develop, use the command below.

    $ rake jekyll:server

  You can view the site at: [http://localhost:4000](http://localhost:4000)

### Edit the styles
  The site uses [SASS](http://sass-lang.com/) and [Compass](http://compass-style.org/) to generate stylesheets.  To automatically update the stylesheets as you develop, use the command below.

    $ rake compass:watch

### Compiling for production
  Run the following command to compile the pages for production:
  
    $rake jekyll:compile
    
  Run the following command to compile the stylesheets for production:
  
    $rake compass:compile
    
### Contributing updates

[Fork the repository](http://help.github.com/fork-a-repo/).

Check out your fork locally:

    $ git clone git@github.com:USERNAME/girldevelopitpgh.com.git

Create a topic branch.

    $ git checkout -b my_update

Make changes, commit, and push them:

    $ git commit -am "Updating such and such for great victory"
    $ git push origin my_update

[Submit a pull request](http://help.github.com/send-pull-requests/).

The project is using [Github Pages](http://pages.github.com/), so the site can be found in the gh-pages branch.