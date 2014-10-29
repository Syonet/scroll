(( ng ) => {
    var $ = ng.element;
    var module = ng.module( "syoScroll", [] );

    var rails = [];
    var applyPx = ( val, prop, obj ) => obj[ prop ] = val + "px";
    var updateRails = () => {
        rails.forEach( updateRail );
    };
    var updateRail = item => {
        var rail = {};
        var bar = {};
        var disabled = false;
        var ourRect = item.rail[ 0 ].getBoundingClientRect();
        var targetRect = item.target.getBoundingClientRect();

        if ( item.axis === "x" ) {
            rail.width = targetRect.width;
            bar.width = ( item.target.clientWidth / item.target.scrollWidth ) * rail.width;
            disabled = bar.width === rail.width;

            bar.width += "px";
            rail.left = targetRect.left;
            rail.top =  targetRect.bottom - ourRect.height;
        } else {
            rail.height = targetRect.height;
            bar.height = ( item.target.clientHeight / item.target.scrollHeight ) * rail.height;
            disabled = bar.height === rail.height;

            bar.height += "px";
            rail.top = targetRect.top;
            rail.left = targetRect.right - ourRect.width;
        }

        // Aplica o sufixo px em todos os valores
        ng.forEach( rail, applyPx );

        // Aplica as propriedades CSS, e desabilita o trilho caso necessário
        item.rail.css( rail ).toggleClass( "syo-disabled", disabled );
        item.bar.css( bar );
    };

    var throttle = ( fn, ms ) => {
        var timeout, ctx, args;

        return function throttledFunction() {
            ctx = this;
            args = arguments;

            if ( timeout ) {
                return;
            }

            setTimeout( () => {
                fn.apply( ctx, args );
                timeout = null;
            }, ms );
        };
    };

    module.run([ "$window", $window => {
        $( $window ).on( "resize", throttle( updateRails, 10 ) );
    }]);

    module.directive( "syoScroll", [ "$compile", ( $compile ) => {
        var dfn = {};

        dfn.restrict = "C";
        dfn.link = ( scope, element, attrs ) => {
            var barX = $( "<syo-scroll-rail axis='x'></syo-scroll-rail>" );
            var barY = $( "<syo-scroll-rail axis='y'></syo-scroll-rail>" );
            var id = attrs.id;

            if ( !id ) {
                id = "scrollTarget" + Date.now();
                attrs.$set( "id", id );
            }

            barX = $compile( barX.attr( "target", id ) )( scope );
            barY = $compile( barY.attr( "target", id ) )( scope );
            element.after( barX ).after( barY );

            updateRails();

            element.on( "mouseenter", () => {
                barX.addClass( "syo-active" );
                barY.addClass( "syo-active" );
            }).on( "mouseleave", () => {
                barX.removeClass( "syo-active" );
                barY.removeClass( "syo-active" );
            }).on( "mousewheel wheel", e => {
                var delta;
                var { scrollLeft, scrollTop } = element[ 0 ];
                e = e.originalEvent || e;

                delta = e.wheelDeltaX || e.deltaX * -40;
                element[ 0 ].scrollLeft -= delta;

                delta = e.wheelDeltaY || e.deltaY * -40;
                element[ 0 ].scrollTop -= delta;

                // Somente dispara o evento scroll caso um scroll tenha ocorrido de fato
                if ( scrollLeft !== element[ 0 ].scrollLeft ||
                     scrollTop !== element[ 0 ].scrollTop ) {
                    element.triggerHandler( "scroll" );
                }
            });
        };

        return dfn;
    }]);

    module.directive( "syoScrollRail", [ "$document", ( $document ) => {
        var dfn = {};

        dfn.restrict = "E";
        dfn.template = "<syo-scroll-bar></syo-scroll-bar>";

        dfn.link = ( scope, element, attrs ) => {
            var railObj;
            var bar = element.find( "syo-scroll-bar" );
            var axis = attrs.axis.trim().toLowerCase();
            var target = $document[ 0 ].getElementById( attrs.target );

            railObj = {
                rail: element,
                bar, target, axis
            };
            rails.push( railObj );

            {
                var [ prevWidth, prevHeight ] = [ target.clientWidth, target.clientHeight ];
                var interval = setInterval( () => {
                    var [ currWidth, currHeight ] = [ target.clientWidth, target.clientHeight ];

                    if ( currWidth !== prevWidth || currHeight !== prevHeight ) {
                        [ prevWidth, prevHeight ] = [ currWidth, currHeight ];
                        updateRail( railObj );
                    }
                }, 100 );

                scope.$on( "$destroy", () => clearInterval( interval ) );
            }

            $( target ).on( "scroll", throttle( () => {
                if ( axis === "x" ) {
                    bar.css( "left", ( target.scrollLeft * 100 ) / target.scrollWidth + "%" );
                } else if ( axis === "y" ) {
                    bar.css( "top", ( target.scrollTop * 100 ) / target.scrollHeight + "%" );
                }
            }, 15 ));
        };

        return dfn;
    }]);

})( angular );