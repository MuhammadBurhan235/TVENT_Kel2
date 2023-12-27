
$(function() {
    'use strict';
        // Form
    var JoinEvent = function() {
        if ($('#JoinEvent').length > 0) {
            $("#JoinEvent").validate({
                rules: {
                    cv:"required",
                    alasan_join: {
                        required: true,
                        minlength: 5
                    }
                },
                messages: {
                    cv: "Tolong Masukkan link CV atau Portofolio anda",
                    alasan_join: "Tolong berikan alasan anda join"
                }
            });
        }
    };
    JoinEvent();
    });
    function goBack() {
        window.history.back();
      }
