package com.example.myapplicationandroid_1

import android.content.Context
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class pantalla_2 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_pantalla2)
        
        val mainView = findViewById<android.view.View>(R.id.main_pantalla2)
        ViewCompat.setOnApplyWindowInsetsListener(mainView) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val etUser = findViewById<EditText>(R.id.etUserRegister)
        val etPass = findViewById<EditText>(R.id.etPassRegister)
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val btnBack = findViewById<Button>(R.id.btnBack)

        val sharedPref = getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)

        btnRegister.setOnClickListener {
            val user = etUser.text.toString()
            val pass = etPass.text.toString()

            if (user.isNotEmpty() && pass.isNotEmpty()) {
                val editor = sharedPref.edit()
                editor.putString("username", user)
                editor.putString("password", pass)
                editor.apply()

                Toast.makeText(this, "Registro guardado exitosamente", Toast.LENGTH_SHORT).show()
                finish() // Regresa al login
            } else {
                Toast.makeText(this, "Por favor completa todos los campos", Toast.LENGTH_SHORT).show()
            }
        }

        btnBack.setOnClickListener {
            finish()
        }
    }
}