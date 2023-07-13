<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        // VerifyEmail::createUrlUsing(function ($notifiable) {
        //     return URL::temporarySignedRoute(
        //         'verification.verify',
        //         now()->addMinutes(60),
        //         ['id' => $notifiable->getKey()]
        //     );
        // });

        // ResetPassword::createUrlUsing(function ($notifiable, $token) {
        //     return config('app.url') . '/reset-password/' . $token . '?email=' . urlencode($notifiable->getEmailForPasswordReset());
        // });
    }
}
