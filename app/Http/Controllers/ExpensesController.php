<?php

namespace App\Http\Controllers;

use App\Enums\StockActionEnum;
use App\Models\Expenses;
use App\Models\Expenseitems;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Enums\ExpenseActionEnum;
use App\Jobs\SendNewExpenseEmail;

class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    public function allExpenses(Request $request)
    {

        !($request->has('status')) && $request['status'] = "all expenses";
        !($request->has('filter')) && $request['filter'] = "all submissions";

        return [
            'expenses' => Expenses::with('author:id,name')
                ->where('store_id', $request->user()->storePreference->store_id)
                ->filter($request->only(['filter', 'status']))
                ->latest()->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['status', 'filter']),
            'full_url' => trim(request()->fullUrlWithQuery(request()->only(['status', 'filter'])))
        ];
    }

    public function getPendingExpenseCount()
    {
        return Expenses::whereCount('status', 0)
            ->where('store_id', '=', \Illuminate\Support\Facades\Auth::user()->storePreference->store_id)
            ->get();
    }

    public function takeAction(Request $request, Expenses $expenses)
    {
        $actionType = $request->action;

        if ($actionType) {
            if ($actionType == 'approve') {
                $expenses->update([
                    'status' => 1
                ]);
            } else if ($actionType == 'decline') {
                $expenses->update([
                    'status' => 2
                ]);
            }

        } else {
            throw new \Exception('Error action type');
        }

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'description' => ['required', 'max:255'],
            'expenseitems' => ['required', 'array', 'min:1'],
            'expenseitems.*.item' => ['required', 'integer', 'distinct'],
            'expenseitems.*.amount' => ['required'],
            'total_amount' => ['required']
        ]);

        DB::transaction(function () use ($request) {

            $newexpense = Expenses::create([
                'description' => $request->description,
                'total_amount' => $request->total_amount,
                'user_id' => $request->user()->id,
                'status' => 0,
                'store_id' => $request->user()->storePreference->store_id
            ]);

            $item_collection = collect($request->expenseitems);
            $item_collection->each(function ($expense, $key) use ($newexpense) {
                Expenseitems::create([
                    'expense_id' => $newexpense->id,
                    'expensedefinition_id' => $expense['item'],
                    'amount' => $expense['amount']
                ]);
            });
            $expense = Expenses::with(['author', 'store', 'expenseitems' => ['expensedefinition']])->where('id', $newexpense->id)->firstOrFail();
            
            // dispatch(new SendNewExpenseEmail($expense));
        });

        return response('new store expense submitted', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Expenses $expenses)
    {
        return Expenses::where('id', $expenses->id)->with(['expenseitems' => ['expensedefinition'], 'author'])->firstOrFail();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expenses $expenses)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expenses $expenses)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expenses $expenses)
    {
        //
    }
}