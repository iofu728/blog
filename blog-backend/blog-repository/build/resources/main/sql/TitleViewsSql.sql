/*
* @Author: gunjianpan
* @Date:   2019-02-06 10:18:33
* @Last Modified by:   gunjianpan
* @Last Modified time: 2019-02-09 22:29:23
*/
use blog;
CREATE TABLE if not exists `title_views` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary keys',
  `title_name` varchar(50) NOT NULL DEFAULT '0' COMMENT 'title name',
  `local_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'local views',
  `zhihu_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'zhihu views',
  `csdn_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'csdn views',
  `jianshu_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'jianshu views',
  `other1_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'other1 views',
  `other2_views` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'other2 views',
  `zhihu_id` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'zhihu id',
  `csdn_id` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'csdn id',
  `jianshu_id` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'jianshu id',
  `other1_id` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'other1 id',
  `other2_id` int(15) unsigned NOT NULL DEFAULT 0 COMMENT 'other2 id',
  `is_deleted` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'deleted flag',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 comment='table for title views';
