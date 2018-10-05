
yarn

sudo yarn run docs:build

if [ ! -d "/usr/local/www/assets" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/assets
fi

if [ ! -d "/usr/local/www/javaScript" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/javaScript
fi

if [ ! -d "/usr/local/www/other" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/other
fi

if [ ! -d "/usr/local/www/pat" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/pat
fi

indexlocation=docs/.vuepress/dist/index.html
sed -i '/<head>/a\<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />' $indexlocation
sed -i '/<head>/a\<link rel="shortcut icon" href="https://cdn.nlark.com/yuque/0/2018/png/104214/1534957905839-d580e42e-3899-4403-be32-c068e5c9eef4.png">' $indexlocation
sed -i '/<head>/a\<meta name="google-site-verification" content="7ULbF13p7e6Z16vpi2tbAPHXHJBVu83TaxPTnvwnA8I" />' $indexlocation
sed -i '/<head>/a\<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113936890-1"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-113936890-1');</script>' $indexlocation
sed -i "/<head>/a\<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WJK56VN');</script>" $indexlocation
sed -i '/<head>/a\<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJK56VN"height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>' $indexlocation
sed -i '/<body>/a\<script type="text/javascript"> docsearch({ apiKey: 'c42b71d494ca78750c7094eb2c55eda6', indexName: 'wyydsb', debug: false }); </script> ' $indexlocation
sed -i '/<body>/a\<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>' $indexlocation

mv docs/.vuepress/dist/* /usr/local/www/

