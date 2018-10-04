package com.pdd.service.taishan.api.controller;

import java.io.IOException;
import java.util.Iterator;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.FileInputFormat;
import org.apache.hadoop.mapred.FileOutputFormat;
import org.apache.hadoop.mapred.JobClient;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapred.TextInputFormat;
import org.apache.hadoop.mapred.TextOutputFormat;

public class PersonVersion {

    public static class MapPre extends MapReduceBase implements
            Mapper<LongWritable, Text, Text, IntWritable> {
        private IntWritable one = new IntWritable(1);
        private Text word = new Text();

        @Override
        public void map(LongWritable key, Text value, OutputCollector<Text, IntWritable> output, Reporter reporter)
                throws IOException {

            KPI kpi = KPI.filterPVs(value.toString());
            if (kpi.getValid() == 1 && kpi.getRemote_addr() != null) {
                word.set(kpi.getRemote_addr());
                output.collect(word, one);
            }
        }
    }

    public static class MapSpider extends MapReduceBase implements
            Mapper<LongWritable, Text, Text, IntWritable> {
        private IntWritable one = new IntWritable(1);
        private Text word = new Text();

        @Override
        public void map(LongWritable key, Text value, OutputCollector<Text, IntWritable> output, Reporter reporter)
                throws IOException {

            KPI kpi = KPI.filterPVs(value.toString());
            if (kpi.getValid() == 0 && kpi.getRemote_addr() != null) {
                word.set(kpi.getRemote_addr());
                output.collect(word, one);
            }
        }
    }

    public static class ReducePre extends MapReduceBase implements
            Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();
        @Override
        public void reduce(Text key, Iterator<IntWritable> values,
                           OutputCollector<Text, IntWritable> output, Reporter reporter)
                throws IOException {
            Integer sum = 0;
            while (values.hasNext()) {
                sum += values.next().get();
            }

            result.set(sum);
            output.collect(key, result);
        }
    }

    public static class MapIn extends MapReduceBase implements
            Mapper<LongWritable, Text, Text, IntWritable> {
        private IntWritable one = new IntWritable(1);
        private Text word = new Text(" ");

        @Override
        public void map(LongWritable key, Text value, OutputCollector<Text, IntWritable> output, Reporter reporter)
                throws IOException {

            if(value.toString() != null) {
                output.collect(word, one);
            }
        }
    }

    public static class ReduceIn extends MapReduceBase implements
            Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();
        @Override
        public void reduce(Text key, Iterator<IntWritable> values,
                           OutputCollector<Text, IntWritable> output, Reporter reporter)
                throws IOException {
            Integer sum = 0;
            while (values.hasNext()) {
                sum += values.next().get();
            }
            result.set(sum);
            output.collect(key, result);
        }
    }

    private static void runJobPv(String inputDir, String outputDir, String jobName, Class<? extends Mapper> mapClass,
                                 Class<? extends Reducer> reduceClass) throws Exception {
        JobConf conf = new JobConf(PersonVersion.class);
        conf.setJobName(jobName);

        conf.setMapOutputKeyClass(Text.class);
        conf.setMapOutputValueClass(IntWritable.class);

        conf.setOutputKeyClass(Text.class);
        conf.setOutputValueClass(IntWritable.class);

        conf.setMapperClass(mapClass);
        conf.setCombinerClass(reduceClass);
        conf.setReducerClass(reduceClass);

        conf.setInputFormat(TextInputFormat.class);
        conf.setOutputFormat(TextOutputFormat.class);

        FileInputFormat.setInputPaths(conf, inputDir);
        FileOutputFormat.setOutputPath(conf, new Path(outputDir));

        JobClient.runJob(conf);
    }

    public static void main(String[] args) throws Exception {

        Long start = System.currentTimeMillis();

        String inputDir = args[0];
        String outputDir = args[1];

        runJobPv(inputDir, outputDir, "KPIPv", MapPre.class, ReducePre.class);
        runJobPv(outputDir, outputDir + "-1", "KPIUv", MapIn.class, ReduceIn.class);

        runJobPv(inputDir, outputDir + "-2", "KPIPVSpider", MapSpider.class, ReducePre.class);
        runJobPv(outputDir + "-2", outputDir + "-3", "KPIUVSpider", MapIn.class, ReduceIn.class);

        Long end = System.currentTimeMillis();
        System.out.println("spend:"+(end-start)+"ms");

        System.exit(0);
    }
}