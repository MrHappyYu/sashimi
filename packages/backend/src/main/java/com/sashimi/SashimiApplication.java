package com.sashimi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.sashimi.module")
public class SashimiApplication {
    public static void main(String[] args) {
        SpringApplication.run(SashimiApplication.class, args);
    }
}
