<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Permission;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::created(function ($user) {
            $user->settings()->create([
                'settings' => \App\Models\UserSetting::defaultSettings()
            ]);
        });
    }

    public function profile()
    {
        return $this->hasOne(Userprofile::class);
    }

    public function scopeSearch($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('name', 'Like', '%' . $search . '%');
            // ->orWhereIn('id',$related_model->toArray());
        });
    }

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'store_users');
    }

    public function storeProducts()
    {
        return $this->hasManyThrough(Product::class, Store::class, 'user_id', 'store_id', 'id', 'id');
    }
    public function storePreference()
    {
        return $this->hasOne(UserCurrentStoreSelection::class);
    }

    static function getUsersWhoCan($permission)
    {
        $p = Permission::findByName($permission,'web');
        $roles = $p->roles->pluck('name');
        $roles[] = 'Super Admin';

        $users = User::whereHas('roles', function ($query) use ($roles) {
            $query->whereIn('name', $roles);
        });
        return $users;
    }

    public function settings()
    {
        return $this->hasOne(UserSetting::class);
    }
}
