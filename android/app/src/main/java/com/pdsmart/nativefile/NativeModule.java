package com.egurueducation.nativefile;

import static java.security.AccessController.getContext;

import static io.invertase.firebase.app.ReactNativeFirebaseApp.getApplicationContext;

import android.content.Context;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Base64OutputStream;
import android.util.Log;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.util.Arrays;

public class NativeModule extends ReactContextBaseJavaModule {
    private static final String TAG = "NativeAction";

    public NativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void getDecryptedURI(String currentUri,String key, Callback callback) throws NoSuchPaddingException, UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException, FileNotFoundException, InvalidAlgorithmParameterException {
        String newUri = readEncryptedFile(currentUri,key);
        JSONObject sendData = new JSONObject();
        try {
            sendData.put("uri", newUri);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        callback.invoke(null, sendData.toString());
    }

    @ReactMethod
    public void getDecryptedFileURI(String currentUri,String key, Callback callback) throws IOException {
        byte[] DecodedFile = null;
        DecodedFile = getStringFile(currentUri);
        byte[] DecryptedFile = decrypt(DecodedFile,key);
        String newUri = getPDF(DecryptedFile);
        JSONObject sendData = new JSONObject();
        try {
            sendData.put("uri", newUri);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        callback.invoke(null, sendData.toString());
    }

    public static String encrypt(String value,String key) {
        try {
            IvParameterSpec iv = new IvParameterSpec(key.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

            byte[] encrypted = cipher.doFinal(value.getBytes());
            byte[] valueLast = Base64.encode(encrypted, Base64.DEFAULT);
            return new String((valueLast));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static String getPDF(byte[] file) {
         // Create Folder
        String RootPath = Environment.getExternalStorageDirectory().toString();
        File folder = new File(RootPath + File.separator + ".file");
        if (!folder.exists()) {
            folder.mkdirs();
        }
        // File Full Path
        String fileName = RootPath + File.separator + ".file" + File.separator + "Convert.pdf";
        try {
            FileOutputStream out = new FileOutputStream(fileName);
            out.write(file);
            out.close();
        } catch (Exception e) {
            // TODO: handle exception
            Log.e("Error", e.toString());
        }
        return fileName;
    }

    public static String getVideo(byte[] file) {
        // Create Folder
        String RootPath = Environment.getExternalStorageDirectory().toString();
        File folder = new File(RootPath + File.separator + ".file");
        if (!folder.exists()) {
            folder.mkdirs();
        }
        // File Full Path
        String fileName = RootPath + File.separator + ".file" + File.separator + "Convert.mp4";
        try {
            FileOutputStream out = new FileOutputStream(fileName);
            out.write(file);
            out.close();
        } catch (Exception e) {
            // TODO: handle exception
            Log.e("Error", e.toString());
        }
        return fileName;
    }

    public static byte[] decrypt(byte[] encrypted,String key) {
        try {
            IvParameterSpec iv = new IvParameterSpec(key.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            return cipher.doFinal(encrypted);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public byte[] getStringFile(String Path) throws IOException {
        File file = new File(Uri.decode(Path));
        byte[] fileData = new byte[(int)file.length()];
        try {
            InputStream is = new FileInputStream(file);

            int read = 0;
            while(read != fileData.length) {
                read += is.read(fileData, read, fileData.length - read);
            }
        } catch (FileNotFoundException e2) {
            e2.printStackTrace();
        }
        return fileData;
    }

    public String fileArrayToString(File[] f){
        String output = "";
        String delimiter = "\n"; // Can be new line \n tab \t etc...
        for (int i=0; i<f.length; i++)
        {
            output = output + f[i].getPath() + delimiter;
        }

        return output;
    }

    public static  String readEncryptedFile(String Path,String key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, FileNotFoundException, UnsupportedEncodingException {
        // Create Folder
        String RootPath = getApplicationContext().getFilesDir().toString();
        File folder = new File(RootPath + File.separator + ".file");
        if (!folder.exists()) {
            folder.mkdirs();
        }
        // File Full Path
        String fileName = RootPath + File.separator + ".file" + File.separator + "pkt.mp4";

        File file = new File(Uri.decode(Path));
        IvParameterSpec iv = new IvParameterSpec(key.getBytes("UTF-8"));
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

        byte[] plainBuf = new byte[8192];
        try (InputStream in = new FileInputStream(file);
             OutputStream out = new FileOutputStream(fileName)) {
            int nread;
            while ((nread = in.read(plainBuf)) > 0) {
                byte[] enc = cipher.update(plainBuf, 0, nread);
                out.write(enc);
            }
            byte[] enc = cipher.doFinal();
            out.write(enc);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        return fileName;
    }
}