all:

.PHONY: release
release:
	zip -r "lsf-filter-$(shell git describe --tag).xpi" \
		src manifest.json *.svg LICENSE
