#!/usr/bin/env bash

source script/constant.sh

yarn

sudo yarn run docs:build

for name in assets javaScript other pat tags icons NLP Spider Operations DB Coding Linux DataMining; do
    if [ ! -d "${NGINX_DIR}/${name}" ]; then
        echo "${NGINX_DIR}/${name}文件不存在"
    else
        rm -rf ${NGINX_DIR}/${name}
    fi
done


sed -i '/<head>/a\<script type="application/ld+json">{"@context": "https://schema.org","@type": "NewsArticle","mainEntityOfPage": {"@type": "WebPage","@id": "https://wyydsb.xin"},"headline": "乌云压顶是吧","image": "https://wyydsb.xin/face.jpg","datePublished": "2017-10-10T08:00:00+08:00","dateModified": "2019-01-01T19:24:025+08:00","author": {"@type": "Person","name": "Huiqiang Jiang"},"publisher": {"@type": "Organization","name": "Huiqiang Jiang","logo": {"@type": "ImageObject","url": "https://wyydsb.xin/favicon.ico"}},"description": "Some coder skills"}</script>' docs/.vuepress/dist/index.html

for htmlFile in docs/.vuepress/dist/*/*.html docs/.vuepress/dist/*.html; do
    needJs=$(cat ${htmlFile} | tail -n 3 | head -n 1)
    sed -i '/preload.*/d' ${htmlFile}
    sed -i "/<head>/a$needJs" ${htmlFile}
    lineNum=$(cat ${htmlFile} | wc -l)
    lineNumLast3=$(expr ${lineNum} - 2)
    sed -i ''"${lineNumLast3}"'d' ${htmlFile}
done

mv docs/.vuepress/dist/* ${NGINX_DIR}/

# nginx serves pre-built .gz/.br blindly (gzip_static/brotli_static), so the
# deploy is not done until the precompressed artifacts are refreshed; this
# also removes orphaned .gz/.br left by the previous build's hashed assets.
if command -v precompress-static.sh >/dev/null; then
    precompress-static.sh "${NGINX_DIR}"
else
    echo "WARNING: precompress-static.sh not found - .gz/.br artifacts are stale!" >&2
fi
