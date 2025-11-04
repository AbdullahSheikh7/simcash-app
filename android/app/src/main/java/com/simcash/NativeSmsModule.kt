package com.simcash

import android.content.Context

import com.nativelocalstorage.NativeSmsSpec
import android.content.Intent
import android.provider.Telephony
import android.telephony.SmsManager
import android.telephony.SubscriptionManager
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class NativeSmsModule(reactContext: ReactApplicationContext) : NativeSmsSpec(reactContext) {

    override fun getName(): String = "SmsModule"

    @ReactMethod
    fun isDefaultSmsApp(promise: Promise) {
        try {
            val currentDefault = Telephony.Sms.getDefaultSmsPackage(reactContext)
            val isDefault = currentDefault == reactContext.packageName
            promise.resolve(isDefault)
        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }

    @ReactMethod
    fun requestDefaultSmsApp() {
        val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
        intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, reactContext.packageName)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
    }

    /**
     * Send SMS.
     * subscriptionId optional: pass null to use default SIM, or an integer subscriptionId for dual-SIM.
     */
    @ReactMethod
    fun sendSms(number: String, message: String, subscriptionId: Int?, promise: Promise) {
        try {
            val smsManager = if (subscriptionId == null) {
                SmsManager.getDefault()
            } else {
                SmsManager.getSmsManagerForSubscriptionId(subscriptionId)
            }
            val parts = smsManager.divideMessage(message)
            val sentIntents = null
            val deliveryIntents = null
            smsManager.sendMultipartTextMessage(number, null, parts, null, null)
            promise.resolve(true)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_DENIED", "Missing SMS permission: ${e.message}")
        } catch (e: Exception) {
            promise.reject("SEND_FAILED", e.message)
        }
    }

    // JS can call this to ask native to emit any saved messages (if RN just started)
    @ReactMethod
    fun emitPendingMessagesToJs() {
        try {
            val app = reactContext.applicationContext as MainApplication
            val svc = BackgroundService() // we only need helper, but avoid creating service; instead, read prefs directly
            val prefs = reactContext.getSharedPreferences("simcash_prefs", Context.MODE_PRIVATE)
            val pending = prefs.all.filterKeys { it.startsWith("pending_sms_") }
            for ((_, v) in pending) {
                val pair = (v as String).split("|", limit = 2)
                val params = Arguments.createMap()
                params.putString("sender", pair.getOrNull(0) ?: "")
                params.putString("body", pair.getOrNull(1) ?: "")
                try {
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("SimCashIncomingSms", params)
                } catch (e: Exception) {
                    Log.e("SmsModule", "emitPendingMessagesToJs emit failed: ${e.message}")
                }
            }
            // clear after sending
            val editor = prefs.edit()
            pending.keys.forEach { editor.remove(it) }
            editor.apply()
        } catch (e: Exception) {
            Log.e("SmsModule", "emitPendingMessagesToJs failed: ${e.message}")
        }
    }

    /**
     * Helper: list active subscription ids and display names for dual-SIM support.
     * Returns a JS array of objects with subscriptionId and displayName via a promise.
     */
    @ReactMethod
    fun getActiveSubscriptions(promise: Promise) {
        try {
            val sm = reactContext.getSystemService(SubscriptionManager::class.java)
            val list = sm.activeSubscriptionInfoList
            val arr = com.facebook.react.bridge.Arguments.createArray()
            list?.forEach { info ->
                val obj = Arguments.createMap()
                obj.putInt("subscriptionId", info.subscriptionId)
                obj.putString("displayName", info.displayName?.toString() ?: "")
                obj.putString("number", info.number ?: "")
                arr.pushMap(obj)
            }
            promise.resolve(arr)
        } catch (e: Exception) {
            promise.reject("ERR_SUBS", e.message)
        }
    }
}
