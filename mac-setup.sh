# Dev environment setup for OSX
#
# After this script has been run, you will have Node and MongoDB installed
# along with the necessary global packages to run a node app with React.
#
# I've chosen to use the Atom text editor because it is free, has a large
# community of plugins available, and is easily configurable from the command
# line. This script installs packages that will give you good syntax highlighting
# and linting (static code checking) right off the bat.
#
# In addition to Atom, this script installs iterm2, a slightly more deluxe
# alternative to OSX's default terminal, and spectacle, which gives you
# keyboard shortcuts to resize windows to 1/2, 1/3, 2/3, or fullscreen (it's
# really handy).
#
# This is by no means the end-all be-all dev environment, it's just a decent
# starting point for a fresh machine. Feel free to add or remove anything
# you want until it suits your needs.

# install homebrew and homebrew cask
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install caskroom/cask/brew-cask

# install mongo and node, which are project dependencies
brew install mongodb
brew cask install node

# configure mongodb. make sure you have mongod running when you go to use it
mkdir -p /data/db

# install some global node packages
sudo npm install -g gulp forever jshint jsxhint

# install some dev tools
brew cask install spectacle iterm2 atom

# install some useful atom packages
apm install react editorconfig linter linter-jshint linter-jsxhint
