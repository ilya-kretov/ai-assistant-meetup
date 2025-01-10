with import <nixpkgs> { };
let

in pkgs.mkShell {
  buildInputs = [ asciidoctor nodejs_20 ];
  shellHook = ''
    export PS1='\[\033[1;32m\][\[\033[1;31m\]asciidoctor:\[\033[1;32m\]\W]\$\[\033[0m\] '
  '';
}
