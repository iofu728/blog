-- 在服务器上执行(表名/库名按实际情况调整):
--   mysql -u<user> -p <db> -N -B -e "SELECT today_views, existed_views, existed_spider, date FROM page_views ORDER BY id DESC LIMIT 2;" > page_views.tsv
--   mysql -u<user> -p <db> -N -B -e "SELECT title_name, local_views, zhihu_views, csdn_views FROM title_views WHERE is_deleted = 0;" > title_views.tsv
-- 然后运行: node scripts/migrate.js page_views.tsv title_views.tsv

SELECT today_views, existed_views, existed_spider, date FROM page_views ORDER BY id DESC LIMIT 2;
SELECT title_name, local_views, zhihu_views, csdn_views FROM title_views WHERE is_deleted = 0;
