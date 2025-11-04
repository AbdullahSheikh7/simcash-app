package com.simcash

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.IBinder
import android.telephony.SubscriptionManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class BackgroundService : Service() {
    private val PREFS = "simcash_prefs"
    private val PENDING_PREFIX = "pending_sms_"

    override fun onCreate() {
        super.onCreate()
        startForegroundServiceNotification()
    }

    private fun startForegroundServiceNotification() {
        val channelId = "sms_background_service"
        val channelName = "SMS Background Service"
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (nm.getNotificationChannel(channelId) == null) {
            val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_LOW)
            nm.createNotificationChannel(channel)
        }
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("SimCash: Service running")
            .setContentText("Listening for incoming SMS")
            .setSmallIcon(android.R.drawable.stat_notify_chat)
            .build()

        startForeground(1001, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val sender = intent?.getStringExtra("sender")
        val body = intent?.getStringExtra("body")

        if (sender != null && body != null) {
            Log.d("BackgroundService", "Processing SMS from $sender")
            // Try to emit to RN if context active; otherwise persist for later retrieval
            val app = application as MainApplication
            val reactContext = app.reactNativeHost.reactInstanceManager.currentReactContext

            if (reactContext != null) {
                val params: WritableMap = Arguments.createMap()
                params.putString("sender", sender)
                params.putString("body", body)
                try {
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("SimCashIncomingSms", params)
                    Log.d("BackgroundService", "Emitted SMS to JS bridge")
                } catch (e: Exception) {
                    Log.e("BackgroundService", "Emit failed: ${e.message}")
                    savePendingSms(sender, body)
                }
            } else {
                Log.d("BackgroundService", "ReactContext not ready — saving SMS")
                savePendingSms(sender, body)
            }
        }

        return START_STICKY
    }

    private fun savePendingSms(sender: String, body: String) {
        val prefs: SharedPreferences = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        // Use timestamp key
        val key = PENDING_PREFIX + System.currentTimeMillis().toString()
        prefs.edit().putString(key, "$sender|$body").apply()
    }

    // Helper to retrieve pending saved messages (JS can call a native method to read these)
    fun readAndClearPending(): Map<String, String> {
        val prefs: SharedPreferences = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val all = prefs.all.filterKeys { it.startsWith(PENDING_PREFIX) }
            .mapValues { it.value as String }
        // clear
        val editor = prefs.edit()
        all.keys.forEach { editor.remove(it) }
        editor.apply()
        return all
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
