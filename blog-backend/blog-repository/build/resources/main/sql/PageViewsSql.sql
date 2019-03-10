/*
* @Author: gunjianpan
* @Date:   2019-02-06 22:20:16
* @Last Modified by:   gunjianpan
* @Last Modified time: 2019-03-07 20:34:07
*/
use blog;
CREATE TABLE if not exists `page_views` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary keys',
  `date` varchar(10) NOT NULL DEFAULT '0000-00-00' COMMENT 'data',
  `today_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'today views',
  `existed_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'existed views',
  `existed_spider` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'existed spider views',
  `is_deleted` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'deleted flag',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 comment='table for page views';
