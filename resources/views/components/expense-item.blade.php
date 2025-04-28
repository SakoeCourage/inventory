@props(['expenseitem'])

<tr>
    <td align="left" class="esdev-adapt-off" style="Margin:0;padding-bottom:10px;padding-right:20px;padding-left:20px;padding-top:10px">
     <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
       <tr>
        <td style="padding:0;Margin:0;width:20px"></td>
        <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
         <table cellpadding="0" cellspacing="0" align="left" class="k" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
           <tr>
            <td align="center" style="padding:0;Margin:0;width:265px">
             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
               <tr>
                <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>{{ $expenseitem->expensedefinition->name  }}</strong></p></td>
               </tr>         
             </table></td>
           </tr>
         </table></td>
        <td style="padding:0;Margin:0;width:20px"></td>
        <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
         <table cellpadding="0" cellspacing="0" align="left" class="k" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
           <tr>
            <td align="left" style="padding:0;Margin:0;width:80px">
             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
               <tr>
                <td align="center" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                </p>
            </td>
               </tr>
             </table></td>
           </tr>
         </table></td>
        <td style="padding:0;Margin:0;width:20px"></td>
        <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
         <table cellpadding="0" cellspacing="0" align="right" class="l" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
           <tr>
            <td align="left" style="padding:0;Margin:0;width:85px">
             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
               <tr>
                <td align="right" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">GHS {{ number_format($expenseitem->amount) }}</p></td>
               </tr>
             </table></td>
           </tr>
         </table></td>
       </tr>
     </table></td>
   </tr>