package com.example.myapplicationandroid_1

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class pantalla_1 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_pantalla1)
        
        val mainView = findViewById<android.view.View>(R.id.main)
        ViewCompat.setOnApplyWindowInsetsListener(mainView) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val etUser = findViewById<EditText>(R.id.etUserLogin)
        val etPass = findViewById<EditText>(R.id.etPassLogin)
        val btnLogin = findViewById<Button>(R.id.btnStart)
        val tvGoToRegister = findViewById<TextView>(R.id.tvGoToRegister)

        val sharedPref = getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)

        btnLogin.setOnClickListener {
            val user = etUser.text.toString()
            val pass = etPass.text.toString()

            val savedUser = sharedPref.getString("username", null)
            val savedPass = sharedPref.getString("password", null)

            if (user == savedUser && pass == savedPass && user.isNotEmpty()) {
                Toast.makeText(this, "Bienvenido $user", Toast.LENGTH_SHORT).show()
                val intent = Intent(this, pantalla_3::class.java)
                startActivity(intent)
                finish()
            } else {
                Toast.makeText(this, "Usuario o contraseña incorrectos", Toast.LENGTH_SHORT).show()
            }
        }

        tvGoToRegister.setOnClickListener {
            val intent = Intent(this, pantalla_2::class.java)
            startActivity(intent)
        }
    }
}