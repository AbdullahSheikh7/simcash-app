package com.simcash

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (Intent.ACTION_BOOT_COMPLETED == intent.action) {
            Log.d("BootReceiver", "Device booted — starting BackgroundService")
            val serviceIntent = Intent(context, BackgroundService::class.java)
            try {
                context.startForegroundService(serviceIntent)
            } catch (e: Exception) {
                context.startService(serviceIntent)
            }
        }
    }
}
