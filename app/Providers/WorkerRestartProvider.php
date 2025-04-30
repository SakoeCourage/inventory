<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Http;

class WorkerRestartProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if(env('APP_ENV') == 'production'){
            $this->restartWorker();
        }
    }

    protected function restartWorker()
    {
        // Set your Fly API token and app name
        $apiToken = 'FlyV1 fm2_lJPECAAAAAAAAg5KxBDl1fGGiAaJ4jJIhZXBPDbGwrVodHRwczovL2FwaS5mbHkuaW8vdjGWAJLOAAcW/B8Lk7lodHRwczovL2FwaS5mbHkuaW8vYWFhL3YxxDxfgf6VRfdr0FSPXwqUrGIUpjP42/s7QDv1CVc/gB3Y9oUnlbXqnP4q87biOW/GQVDAhho9s5kIovX8XgzETnjZOdwj1vYLwRd/lJAuVNKdcQECgOl/YLOah/CjNhIl8PTCYfWn2ay3xVVq8yg/G0W4ZJJAjWDsZdjO7+W4HNszSX9vz5fHcK6IubHNTA2SlAORgc4AcmaPHwWRgqdidWlsZGVyH6J3Zx8BxCDVFVfndFq8GkMEXKNpK8uU+qQhfqISasTNUHajmDlIPA==,fm2_lJPETnjZOdwj1vYLwRd/lJAuVNKdcQECgOl/YLOah/CjNhIl8PTCYfWn2ay3xVVq8yg/G0W4ZJJAjWDsZdjO7+W4HNszSX9vz5fHcK6IubHNTMQQGWjCvCk1cKX949pPHKAOGMO5aHR0cHM6Ly9hcGkuZmx5LmlvL2FhYS92MZgEks5oDy/hzo2nNf8XzgAGu0gKkc4ABrtIDMQQea1KZem1wH8Q6QPI2yfzscQgjxIS3ovKEmWs7TT6rP7ljZKUSMcgHcwPxr4devKkN3Y=';
        $appName = 'inventorylite';

      
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiToken,
        ])->get("https://api.machines.dev/v1/apps/{$appName}/machines");

      
        if ($response->failed()) {
            \Log::error('Failed to fetch machines: ' . $response->body());
            return;
        }

        $machines = $response->json();
        $worker_machine = null;


        foreach ($machines as $machine) {

            if ($machine['config']['env']['FLY_PROCESS_GROUP'] === 'worker') {
                $worker_machine = $machine;
            }
            if ($worker_machine !== null) {
                if ($worker_machine['state'] == 'started') {
                    return;
                }
                $workerMachineId = $worker_machine['id'];
                $restartResponse = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiToken,
                ])->post("https://api.machines.dev/v1/apps/{$appName}/machines/{$workerMachineId}/start");

                if ($restartResponse->failed()) {
                    \Log::error('Failed to restart the worker: ' . $restartResponse->body());
                } else {
                    \Log::info('Worker machine restart request sent successfully.');
                }

            } else {
                // \Log::error('Worker machine not found.');
            }
        }

    }
}
