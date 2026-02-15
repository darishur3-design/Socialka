package ru.nngasu.socialka.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    public String verifyToken(String token) throws Exception {

        // если token приходит "Bearer xxx"
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);

        return decodedToken.getUid();
    }
}
