.PHONY: js
js:
	mkdir -p js
	tsc src/*.ts --module es2020 --lib es2020,dom --target es2020 --outDir js

server:
	python3 -m http.server

rawdist:
	zip -r dist.zip js
	zip -r dist.zip index.html

linecount:
	(cd src; find . -name '*.ts' | xargs wc -l)