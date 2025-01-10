all:
	@echo run some stages
prepare:
	@npm install
clean:
	@find -type f -name "*.html" -print -delete
build:
	@find -type f \( -name "*.adoc" ! -name "README.adoc" ! -path "./node_modules/*" \) \
		-print -exec npx asciidoctor-revealjs {} \;

