package ru.nngasu.socialka.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class QRCodeService {

    public String generateQRCodeBase64(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        return Base64.getEncoder().encodeToString(pngData);
    }

    public String generateUniqueToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    public String createQRData(Integer eventId, Integer userId) {
        String token = generateUniqueToken();
        // Формируем JSON-подобную строку с данными
        return String.format("EVENT:%d|USER:%d|TOKEN:%s|TIME:%d",
                eventId, userId, token, System.currentTimeMillis());
    }
}