// Not sure if this was part of the work done for the ordering system. Isolating it. It is currently not included in any of the pages.

transactionNumbers = "<#PARAM name='TransactionNumbers'>";
sessionID = "<#PARAM name='SessionID'>";

$(document).ready(function() {
  $("#pay").click(function() {
    $("#loadingPanel").show();
    $("input[type=button]").attr("disabled", "disabled");
    $.get("aeon.dll/ajax?query=InitiatePayment", {
      TransactionNumbers: transactionNumbers,
      SessionID: sessionID,
      ProviderSystemId: 'PayPal'
    }, function(response, status, xhr) {

      var hasError = false;

      if (response.toLowerCase().indexOf("error: ") == 0) {
        $("#paymentResult").html(response.substring(6));
        hasError = true;
      } else if (status == "error") {
        $("#paymentResult").html("An error has occurred while attempting to process your payment.");
        hasError = true;
      }

      if (hasError) {
        $("#loadingPanel").hide()
        $("#paymentResult").toggleClass("error", true);
        $("#paymentResult").toggleClass("success", false);
        $("input[type=button]").removeAttr("disabled");
      } else {
        $("#paymentResult").toggleClass("error", false);
        $("#paymentResult").toggleClass("success", true);
        $('input[name=invoice]').val(response.toString());
        $("#paypalform").submit();
      }
    });
  });

  $("#cancel").click(function() {
    window.location.replace("<#DLL queryFields=false>?action=10&form=10");
  });
});
