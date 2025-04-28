<x-wraper>
    <table cellpadding="0" cellspacing="0" align="center" class="g" role="none"
        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
        <tr>
            <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="z" role="none"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                    <tr>
                        <td align="left"
                            style="padding:0;Margin:0;padding-top:15px;padding-right:20px;padding-left:20px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" style="padding:0;Margin:0;padding-bottom:10px">
                                                    <h1 class="u"
                                                        style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:46px;color:#14532d">
                                                        <strong>Expense Request</strong>
                                                    </h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table cellpadding="0" cellspacing="0" align="center" class="g" role="none"
    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
    <tr>
        <td align="center" style="padding:0;Margin:0">
            <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="z" role="none"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                <tr style="">
                    <td align="center" valign="top"
                        style="padding:0;Margin:0;width:560px; padding-top: 10px; padding-bottom: 15px;">
                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <h2 class="sm-small flex justify-center"
                                        style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:12px;font-style:normal;font-weight:bold;line-height:13.2px;olor:#134e4a; opacity: 0.5;">
                                        {{ $expense->store->store_name . ' - ' . $expense->store->branch->branch_name }}
                                    </h2>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
                <tr style="border-spacing:0px;border-top:2px solid #efefef;border-bottom:2px solid #efefef; padding-top: 10px">
                    <td align="left" style="padding:20px;Margin:0">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                                <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td align="center" style="padding:0;Margin:0">
                                                <h2 class="sm-small  justify-center"
                                                    style=" Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:31.2px;color:#333333; text-align: center;">
                                                    <strong style="white-space: nowrap;color:#134e4a; text-decoration: underline;">{{ $expense->author->name }}</strong> 
                                                    requested an expense that you may need to approve:
                                                </h2>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td align="center" style="padding:0;Margin:0">
                                                <p class="sm-small  justify-center"
                                                    style=" Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:12px;font-style:normal;font-weight:normal;line-height:31.2px;color:#5e5d5d; text-align: center; padding: 5px; padding-left: 10px; padding-right: 10px; background-color: #f4faf9; ; border-radius: 5px; ">
                                                    {{ $expense->description  }} 
                                            </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                       
                        </table>
                    </td>
                </tr>
                @foreach ($expense->expenseitems as $expense_item)
                    <x-expense-item  :expenseitem="$expense_item"/>
                @endforeach
                <tr>
                    <td align="left"
                        style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:10px">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                                <td align="center" class="bd" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-top:2px solid #efefef;border-bottom:2px solid #efefef"
                                        role="presentation">
                                        <tr>
                                            <td align="right"
                                                style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px">
                                                <p class="t"
                                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">     
                                                    Total:&nbsp;<strong>GHS{{ number_format($expense->total_amount) }}</strong>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td align="left" style="padding:0px;Margin:0">
         <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
           <tr>
            <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
               <tr>
                <td align="center" style="padding:0;Margin:0;padding-top:25px;padding-bottom:15px"><span class="r" style="border-style:solid;border-color:#14532d;background:#14532d;border-width:2px;display:inline-block;border-radius:6px;width:auto"><a href="{{ env('BASE_URL').'/expenses?view=expenseHistory' }}" target="_blank" class="n" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#14532d;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid color:#14532d;border-left-width:30px;border-right-width:30px">VIEW REQUEST</a></span></td>
               </tr>
             </table></td>
           </tr>
         </table>
      </td>
       </tr>
</table>
    @php
    // dd($expense);
@endphp
</x-wraper>
