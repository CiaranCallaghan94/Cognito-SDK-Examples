package com.amazon.ps.dms.dub.amplifycognito;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.Callback;
import com.amazonaws.mobile.client.HostedUIOptions;
import com.amazonaws.mobile.client.SignInUIOptions;
import com.amazonaws.mobile.client.SignOutOptions;
import com.amazonaws.mobile.client.UserStateDetails;
import com.amazonaws.mobile.client.results.SignInResult;
import com.amazonaws.mobile.client.results.Tokens;

public class MainActivity extends AppCompatActivity {

    private final String TAG = "COGNITO-SDK-EXAMPLES";
    AWSMobileClient client;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        client = AWSMobileClient.getInstance();
        client.initialize(getApplicationContext(), new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails result) {
                Log.i(TAG, "UserState changed: " + result.getUserState());
            }

            @Override
            public void onError(Exception e) {
                Log.i(TAG, "UserState error: " + e);
            }
        });

        findViewById(R.id.btn_sign_in).setOnClickListener(new SignInListener());
        findViewById(R.id.btn_sign_in_hosted_ui).setOnClickListener(new HostedUIListener(this));
        findViewById(R.id.btn_sign_in_built_in_ui).setOnClickListener(new BuiltInUIListener(this));
        findViewById(R.id.btn_global_sign_out).setOnClickListener(new SignOutListener());
        findViewById(R.id.btn_current_user).setOnClickListener(new CurrentUserListener());
        findViewById(R.id.btn_current_session).setOnClickListener(new CurrentSessionListener());
    }

    class SignInListener implements View.OnClickListener {

        @Override
        public void onClick(View view) {
            client.signIn(getString(R.string.username), getString(R.string.password), null, new Callback<SignInResult>() {
                @Override
                public void onResult(final SignInResult signInResult) {
                    runOnUiThread(() -> {
                        Log.d(TAG, "Sign-in state: " + signInResult.getSignInState());
                        switch (signInResult.getSignInState()) {
                            case DONE:
                                Toast.makeText(view.getContext(), "Sign-in done.", Toast.LENGTH_LONG).show();
                                break;
                            case SMS_MFA:
                                Toast.makeText(view.getContext(), "Please confirm sign-in with SMS.", Toast.LENGTH_LONG).show();
                                break;
                            case NEW_PASSWORD_REQUIRED:
                                Toast.makeText(view.getContext(), "Please confirm sign-in with new password.", Toast.LENGTH_LONG).show();
                                break;
                            default:
                                Toast.makeText(view.getContext(), "Unsupported sign-in confirmation: " + signInResult.getSignInState(), Toast.LENGTH_LONG).show();
                                break;
                        }
                    });
                }

                @Override
                public void onError(Exception e) {
                    Log.e(TAG, "Sign-in error", e);
                }
            });

        }
    }

    class HostedUIListener implements View.OnClickListener {

        private Activity callingActivity;

        HostedUIListener(Activity callingActivity) {
            this.callingActivity = callingActivity;
        }

        @Override
        public void onClick(View view) {
            AWSMobileClient.getInstance().showSignIn(
                    callingActivity,
                    SignInUIOptions.builder()
                            .hostedUIOptions(HostedUIOptions.builder().build())
                            .nextActivity(MainActivity.class)
                            .build(), new Callback<UserStateDetails>() {
                        @Override
                        public void onResult(UserStateDetails result) {
                            Log.i(TAG, "Sign-in done. " + result.getUserState());
                        }

                        @Override
                        public void onError(Exception e) {
                            Log.e(TAG, "Sign-in error", e);
                        }
                    });
        }
    }

    class BuiltInUIListener implements View.OnClickListener {

        private Activity callingActivity;

        BuiltInUIListener(Activity callingActivity) {
            this.callingActivity = callingActivity;
        }

        @Override
        public void onClick(View view) {
            AWSMobileClient.getInstance().showSignIn(
                    callingActivity,
                    SignInUIOptions.builder()
                            .nextActivity(MainActivity.class)
                            .build(), new Callback<UserStateDetails>() {
                        @Override
                        public void onResult(UserStateDetails result) {
                            Log.i(TAG, "Sign-in done. " + result.getUserState());
                        }

                        @Override
                        public void onError(Exception e) {
                            Log.e(TAG, "Sign-in error", e);
                        }
                    });
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Intent activityIntent = getIntent();
        if (activityIntent.getData() != null &&
                "cognitoexample".equals(activityIntent.getData().getScheme())) {
            AWSMobileClient.getInstance().handleAuthResponse(activityIntent);
        }
    }

    class SignOutListener implements View.OnClickListener {

        @Override
        public void onClick(View view) {
            client.signOut(SignOutOptions.builder().signOutGlobally(true).invalidateTokens(true).build(), new Callback<Void>() {
                @Override
                public void onResult(Void result) {
                    runOnUiThread(() -> Toast.makeText(view.getContext(), "Sign-out done", Toast.LENGTH_LONG).show());
                }

                @Override
                public void onError(Exception e) {
                    Log.e(TAG, "Sign-out error", e);
                }
            });

        }
    }

    class CurrentUserListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            String username = client.getUsername() == null ? "No user logged" : client.getUsername();
            Toast.makeText(view.getContext(), username, Toast.LENGTH_LONG).show();
        }
    }

    class CurrentSessionListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            client.getTokens(new Callback<Tokens>() {
                @Override
                public void onResult(Tokens result) {
                    runOnUiThread(() ->
                            Toast.makeText(view.getContext(), "Tokens logged in the Logcat", Toast.LENGTH_LONG).show());
                    Log.i(TAG, "ID Token: " + result.getIdToken().getTokenString());
                    Log.i(TAG, "Access Token: " + result.getAccessToken().getTokenString());
                    Log.i(TAG, "Refresh Token: " + result.getRefreshToken().getTokenString());
                }

                @Override
                public void onError(Exception e) {
                    Log.e(TAG, "Get Tokens error", e);
                }
            });
        }
    }

}
