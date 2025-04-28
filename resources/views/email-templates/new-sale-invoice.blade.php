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
                                                        <strong>Sale Invoice</strong>
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
                    <tr>
                        <td align="left" style="padding:20px;Margin:0">
                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" style="padding:0;Margin:0">
                                                    <h2 class="sm-small flex justify-center"
                                                        style="color:#134e4a; Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:bold;line-height:31.2px;color:#333333; text-align: center;">
                                                        {{ $sale->sale_invoice }}
                                                        has
                                                        been processed&nbsp;
                                                    </h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top"
                                        style="padding:0;Margin:0;width:560px; padding-top: 10px;">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" style="padding:0;Margin:0">
                                                    <h2 class="sm-small flex justify-center"
                                                        style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:12px;font-style:normal;font-weight:bold;line-height:13.2px;olor:#134e4a; opacity: 0.5;">
                                                        {{ $sale->store->store_name . ' - ' . $sale->store->branch->branch_name }}
                                                    </h2>
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @foreach ($sale->saleitems as $sale_item)
                        <x-invoice-item :saleitem="$sale_item" />
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
                                                        Payment
                                                        Method:&nbsp;<strong>{{ $sale->paymentmethod->method }}</strong><br>
                                                        Subtotal:&nbsp;<strong>GHS
                                                            {{ number_format($sale->sub_total) }}</strong><br>
                                                        Discount:&nbsp;<strong> {{ $sale->discount ?? 0 }}%</strong><br>
                                                        Total:&nbsp;<strong>GHS {{ number_format($sale->total_amount) }}</strong>
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
    </table>
</x-wraper>
