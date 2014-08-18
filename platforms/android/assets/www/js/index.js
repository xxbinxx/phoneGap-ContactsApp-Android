/*
 *@author: Bineet kumar gaur
 * copyright 2014
 *
 *   Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    },
    // save contact
    saveContacts: function() {
        console.log('save contact function started');
        var contact = navigator.contacts.create();
        contact.displayName = $('#first').val() + " " + $('#last').val();
        contact.note = $('#note').val();
        contact.save(app.onSave, app.onError);
        console.log(contact);
    },
    // find all contacts
    openContacts: function() {
        app.initialize();
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        var fields = ["*"]; //"*" will return all contact fields
        navigator.contacts.find(fields, app.onSuccess, app.onError, options);
    },
    // Empty contact database
    deleteAllTheContacts: function() {
        var deleteContact = function(contacts) {
            console.log("length = " + contacts.length);
            // No contacts left, stop saving
            if (contacts.length == 0) {
                console.log("All contacts removed");
                return;
            }

            var contact = contacts.pop();
            contact.remove(function() {
                deleteContact(contacts);
            }, null);
        };

        navigator.contacts.find(["*"], deleteContact, app.onError, {
            "multiple": true
        });
    },
    // Remove a particular contact using it's ID
    removeThisContact: function(id, name) {
        console.log("removing contact : " + name);

        var options = new ContactFindOptions();
        options.filter.id = id;
        options.multiple = "true";
        var fields = ["displayName", "name"];
        navigator.contacts.find(fields, deleteThis, app.onError, options);

        function deleteThis(contacts) {
            var contact = contacts.pop();
            console.log('inside deleThis: parameter passed: ' + contacts);
            console.log("popped out:" + contact);
            contact.remove(function() {
                $('#status-area')
                    .flash_message({
                        text: 'Contact Removed!',
                        how: 'append'
                    });
                app.openContacts();
            }, null);
        }
    },
    // Flash a message after save.
    onSave: function(contact) {
        $('#status-area').flash_message({
            text: 'Contact saved!',
            how: 'append'
        });
        $('input[type=text').val('');
    },
    // Find all the contacts and log them to console
    find: function(filter) {
        var options = new ContactFindOptions();
        options.filter = this.filter;
        options.multiple = "true";
        var fields = ["displayName", "name"];
        navigator.contacts.find(fields, logToConsole, app.onError, options);

        function logToConsole(contacts) {
            console.log('contacts.length: ' + contacts.length);
            for (var i = 0; i < contacts.length; i++) {
                console.log("Display Name = " + contacts[i].displayName);
            }
        }
    },
    // Write contacts in DOM
    onSuccess: function(contacts) {
        var li = '';
        $.each(contacts, function(key, value) {
            if (value.name) {
                $.each(value.name, function(key, value) {
                    if (key === 'formatted') {
                        name = value;
                    }
                });
            }
            if (value.note) {
                note = value.note;
            }
            if (value.id) {
                id = value.id;
            }
            console.log("id : " + id + "-> name : " + name + " -> note : " + note);
            li += '<li style="text-decoration:none;"><b>Name</b>: ' + name + '<div class="removeIcon pullRight" onclick="app.removeThisContact(\'' + id + '\',\'' + name + '\')">&nbsp;</div><br><b> Note:</b> ' + note + '</li>';
        });
        $("#contact").html(li);
    },
    onError: function(contactError) {
        alert('onError!' + contactError.code);
    }
};


// Flash message
$.fn.flash_message = function(options) {
    options = $.extend({
        text: 'Done',
        time: 1000,
        how: 'before',
        class_name: ''
    }, options);

    return $(this).each(function() {
        if ($(this).parent().find('.flash_message').get(0))
            return;

        var message = $('<span />', {
            'class': 'flash_message ' + options.class_name,
            text: options.text
        }).hide().fadeIn('fast');

        $(this)[options.how](message);

        message.delay(options.time).fadeOut('normal', function() {
            $(this).remove();
        });

    });
};