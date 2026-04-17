# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_22
    pkgs.python3
    pkgs.android-tools
    pkgs.javacc
    pkgs.snake4
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
      "usernamehw.errorlens@3.26.0"
      "ms-vscode.js-debug@1.112.0"
      "huytd.tokyo-city@0.2.4"
    ];
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["python3" "-m" "http.server" "$PORT" "--bind" "0.0.0.0" "--directory" "frontend"];
          manager = "web";
        };
      };
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        npm-install = "npm install --prefix backend";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ "frontend/style.css" "frontend/main.js" "frontend/index.html" "backend/index.js" ];
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Start a background task for the backend API
        start-backend = "npm install --prefix backend && node backend/index.js";
      };
    };
  };
}