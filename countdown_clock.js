
OnWindowLoad = Class.create( {
    to_load: [],
    to_load_last: [],
    loaded: [],
    flags: {
        is_running: false,
        window_loaded: false
    },

    initialize: function( f, options ) {
        this.f = f;

        options = Object.extend( {
            load_last: false
        }, options );

        if ( options.load_last ) {
            this.to_load_last.push( this );
        }
        else {
            this.to_load.push( this );
        }
    },

    run: function() {
        if ( !this.flags.window_loaded || this.flags.is_running ) {
            return;
        }
        else {
            this.flags.is_running = true;
        }

        // run it
        this.f();

        this.flags.is_running = false;

        // shift the loader object to the finish list
        this.loaded.push( this.to_load.shift() );

        // run the next one
        this.next();
    },

    next: function() {
        this.flags.window_loaded = true;

        if ( !this.to_load.length && this.to_load_last.length ) {
            while ( this.to_load_last.length ) {
                this.to_load.push( this.to_load_last.shift() );
            }
        }

        // run 'em if we got 'em
        if ( this.to_load.length ) {
            this.to_load[0].run();
        }
    }
} );
Event.observe( window, 'load', OnWindowLoad.prototype.next.bind( OnWindowLoad.prototype ) );


CountdownClock = Class.create( {
initialize: function( data ) {
this.minutes = $(data.minutes);
this.seconds = $(data.seconds);
this.time_left = $(data.time_left);
this.is_running = false;
this.callbacks = [];
this.update_time_display();
},
add_timeout_handler: function( callback ) {
if ( !this.is_running && this.start_time && this.get_time_left() == 0 ) {
callback();
}
else {
this.callbacks.push( callback );
}
},
start: function() {
this.is_running = true;
this.start_time = new Date();
this.update_time_display();
},
stop: function() {
if ( this.timeout ) {
clearTimeout( this.timeout );
delete this.timeout;
}
},
get_time_left: function() {
var now = new Date();
var elapsed = Math.floor( (now - this.start_time) / 1000 );
var time_left = this.time_left - elapsed;
if ( time_left < 0 )
time_left = 0;
return time_left;
},
update_time_display: function() {
var time_left = this.get_time_left();
var minutes = Math.floor( time_left/60 );
var seconds = time_left % 60;
if ( seconds < 10 )
seconds = "0" + seconds;
if ( minutes < 10 )
minutes = "0" + minutes;
this.minutes.innerHTML = minutes;
this.seconds.innerHTML = seconds;
if ( this.is_running ) {
if ( time_left > 0 ) {
this.timeout = setTimeout( this.update_time_display.bind( this, this.update_time_display ), 1000 );
}
else {
this.stop();
for ( var i = 0 ; i < this.callbacks.length ; i ++ ) {
this.callbacks[i]();
}
}
}
}
});
