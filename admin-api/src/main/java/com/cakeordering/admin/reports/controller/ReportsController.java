package com.cakeordering.admin.reports.controller;

import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/reports")
public class ReportsController {

    @GetMapping("/sales.csv")
    public void exportSalesCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sales_report.csv");
        
        CSVWriter writer = new CSVWriter(new OutputStreamWriter(response.getOutputStream()));
        writer.writeNext(new String[]{"Date", "Order Number", "Total", "Status"});
        writer.writeNext(new String[]{"2024-01-01", "1234", "1000.00", "delivered"});
        writer.close();
    }

    @GetMapping("/orders.csv")
    public void exportOrdersCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders_report.csv");
        
        CSVWriter writer = new CSVWriter(new OutputStreamWriter(response.getOutputStream()));
        writer.writeNext(new String[]{"Order Number", "Customer", "Date", "Total", "Status"});
        writer.close();
    }
}
