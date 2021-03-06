/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module('mm.foundation.tooltip', ['mm.foundation.position', 'mm.foundation.bindHtml'])

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider('$tooltip', function() {
    'ngInject';
    // The default options tooltip and popover.
    var defaultOptions = {
        placement: 'top',
        popupDelay: 0
    };

    // Default hide triggers for each show trigger
    var triggerMap = {
        'mouseover': 'mouseout',
        'click': 'click',
        'focus': 'blur'
    };

    // The options specified to the provider globally.
    var globalOptions = {};

    /**
     * `options({})` allows global configuration of all tooltips in the
     * application.
     *
     *   var app = angular.module( 'App', ['mm.foundation.tooltip'], function( $tooltipProvider ) {
     *     // place tooltips left instead of top by default
     *     $tooltipProvider.options( { placement: 'left' } );
     *   });
     */
    this.options = function(value) {
        angular.extend(globalOptions, value);
    };

    /**
     * This allows you to extend the set of trigger mappings available. E.g.:
     *
     *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
     */
    this.setTriggers = function setTriggers(triggers) {
        angular.extend(triggerMap, triggers);
    };

    /**
     * This is a helper function for translating camel-case to snake-case.
     */
    function snake_case(name) {
        var regexp = /[A-Z]/g;
        var separator = '-';
        return name.replace(regexp, function(letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }

    /**
     * Returns the actual instance of the $tooltip service.
     * TODO support multiple triggers
     */
    this.$get = function($window, $compile, $timeout, $parse, $document, $position, $interpolate, $animate) {
        'ngInject';
        return function $tooltip(type, prefix, defaultTriggerShow) {
            var options = angular.extend({}, defaultOptions, globalOptions);

            /**
             * Returns an object of show and hide triggers.
             *
             * If a trigger is supplied,
             * it is used to show the tooltip; otherwise, it will use the `trigger`
             * option passed to the `$tooltipProvider.options` method; else it will
             * default to the trigger supplied to this directive factory.
             *
             * The hide trigger is based on the show trigger. If the `trigger` option
             * was passed to the `$tooltipProvider.options` method, it will use the
             * mapped trigger from `triggerMap` or the passed trigger if the map is
             * undefined; otherwise, it uses the `triggerMap` value of the show
             * trigger; else it will just use the show trigger.
             */
            function getTriggers(trigger) {
                var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
                var hide = show.map(function(trigger) {
                    return triggerMap[trigger] || trigger;
                });
                return {
                    show: show,
                    hide: hide
                };
            }

            var directiveName = snake_case(type);

            var startSym = $interpolate.startSymbol();
            var endSym = $interpolate.endSymbol();
            var template =
                '<div ' + directiveName + '-popup ' +
                'title="' + startSym + 'tt_title' + endSym + '" ' +
                'content="' + startSym + 'tt_content' + endSym + '" ' +
                'placement="' + startSym + 'tt_placement' + endSym + '" ' +
                'is-open="tt_isOpen"' +
                '>' +
                '</div>';

            return {
                restrict: 'EA',
                scope: true,
                compile: function(tElem) {
                    var tooltipLinker = $compile(template);

                    return function link(scope, element, attrs) {
                        var tooltip;
                        var popupTimeout;
                        var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
                        var triggers = getTriggers(undefined);
                        var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);

                        var positionTooltip = function() {
                            var position;
                            var ttWidth;
                            var ttHeight;
                            var ttPosition;
                            // Get the position of the directive element.
                            position = appendToBody ? $position.offset(element) : $position.position(element);

                            // Get the height and width of the tooltip so we can center it.
                            ttWidth = tooltip.prop('offsetWidth');
                            ttHeight = tooltip.prop('offsetHeight');

                            // Calculate the tooltip's top and left coordinates to center it with
                            // this directive.
                            switch (scope.tt_placement) {
                                case 'right':
                                    ttPosition = {
                                        top: position.top + position.height / 2 - ttHeight / 2,
                                        left: position.left + position.width + 10
                                    };
                                    break;
                                case 'bottom':
                                    ttPosition = {
                                        top: position.top + position.height + 10,
                                        left: position.left - ttWidth / 2 + position.width / 2,
                                    };
                                    break;
                                case 'left':
                                    ttPosition = {
                                        top: position.top + position.height / 2 - ttHeight / 2,
                                        left: position.left - ttWidth - 10,
                                    };
                                    break;
                                default:
                                    ttPosition = {
                                        top: position.top - ttHeight - 10,
                                        left: position.left - ttWidth / 2 + position.width / 2,
                                    };
                                    break;
                            }

                            ttPosition.top += 'px';
                            ttPosition.left += 'px';

                            // Now set the calculated positioning.
                            tooltip.css(ttPosition);

                        };

                        // By default, the tooltip is not open.
                        // TODO add ability to start tooltip opened
                        scope.tt_isOpen = false;

                        function toggleTooltipBind() {
                            if (!scope.tt_isOpen) {
                                showTooltipBind();
                            } else {
                                hideTooltipBind();
                            }
                        }

                        // Show the tooltip with delay if specified, otherwise show it immediately
                        function showTooltipBind() {
                            if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                                return;
                            }
                            if (scope.tt_popupDelay) {
                                popupTimeout = $timeout(show, scope.tt_popupDelay, false);
                                popupTimeout.then(function(reposition) {
                                    reposition();
                                }, angular.noop);
                            } else {
                                show()();
                            }
                        }

                        function hideTooltipBind() {
                            scope.$apply(function() {
                                hide();
                            });
                        }

                        // Show the tooltip popup element.
                        function show() {


                            // Don't show empty tooltips.
                            if (!scope.tt_content) {
                                return angular.noop;
                            }

                            createTooltip();

                            // Set the initial positioning.
                            tooltip.css({
                                top: 0,
                                left: 0,
                            });

                            // Now we add it to the DOM because need some info about it. But it's not
                            // visible yet anyway.
                            if (appendToBody) {
                                // $document.find('body').append(tooltip);
                                // $document.find('body')
                                $animate.enter(tooltip, $document.find('body'));
                            } else {
                                $animate.enter(tooltip, element.parent(), element);
                                // element.after(tooltip);
                            }

                            positionTooltip();

                            // And show the tooltip.
                            scope.tt_isOpen = true;
                            scope.$digest(); // digest required as $apply is not called

                            // Return positioning function as promise callback for correct
                            // positioning after draw.
                            return positionTooltip;
                        }

                        // Hide the tooltip popup element.
                        function hide() {
                            // First things first: we don't show it anymore.
                            scope.tt_isOpen = false;

                            //if tooltip is going to be shown after delay, we must cancel this
                            $timeout.cancel(popupTimeout);
                            removeTooltip();
                        }

                        function createTooltip() {
                            // There can only be one tooltip element per directive shown at once.
                            if (tooltip) {
                                removeTooltip();
                            }
                            tooltip = tooltipLinker(scope, () => {});

                            // Get contents rendered into the tooltip
                            scope.$digest();
                        }

                        function removeTooltip() {
                            if (tooltip) {
                                $animate.leave(tooltip);
                                // tooltip.remove();
                                tooltip = null;
                            }
                        }

                        /**
                         * Observe the relevant attributes.
                         */
                        attrs.$observe(type, function(val) {
                            scope.tt_content = val;

                            if (!val && scope.tt_isOpen) {
                                hide();
                            }
                        });

                        attrs.$observe(prefix + 'Title', function(val) {
                            scope.tt_title = val;
                        });

                        attrs[prefix + 'Placement'] = attrs[prefix + 'Placement'] || null;

                        attrs.$observe(prefix + 'Placement', function(val) {
                            scope.tt_placement = angular.isDefined(val) && val ? val : options.placement;
                        });

                        attrs[prefix + 'PopupDelay'] = attrs[prefix + 'PopupDelay'] || null;

                        attrs.$observe(prefix + 'PopupDelay', function(val) {
                            var delay = parseInt(val, 10);
                            scope.tt_popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                        });

                        var unregisterTriggers = function() {
                            triggers.show.forEach(function(showTrigger, i) {
                                var hideTrigger = triggers.hide[i];
                                if (showTrigger === hideTrigger) {
                                    element.off(showTrigger, toggleTooltipBind);
                                } else {
                                    element.off(showTrigger, showTooltipBind);
                                    element.off(hideTrigger, hideTooltipBind);
                                }
                            });
                        };


                        attrs[prefix + 'Trigger'] = attrs[prefix + 'Trigger'] || null;

                        attrs.$observe(prefix + 'Trigger', function(val) {
                            unregisterTriggers();
                            triggers = getTriggers(val);
                            triggers.show.forEach(function(showTrigger, i) {
                                var hideTrigger = triggers.hide[i];
                                if (showTrigger === hideTrigger) {
                                    element.bind(showTrigger, toggleTooltipBind)
                                } else {
                                    element.bind(showTrigger, showTooltipBind);
                                    element.bind(hideTrigger, hideTooltipBind);
                                }
                            });
                            element.on('keydown', function (e) {
                                if (e.which === 27) {
                                    hideTooltipBind();
                                }
                            });
                        });

                        attrs.$observe(prefix + 'AppendToBody', function(val) {
                            appendToBody = angular.isDefined(val) ? $parse(val)(scope) : appendToBody;
                        });

                        // if a tooltip is attached to <body> we need to remove it on
                        // location change as its parent scope will probably not be destroyed
                        // by the change.
                        if (appendToBody) {
                            scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
                                if (scope.tt_isOpen) {
                                    hide();
                                }
                            });
                        }

                        // Make sure tooltip is destroyed and removed.
                        scope.$on('$destroy', function onDestroyTooltip() {
                            $timeout.cancel(popupTimeout);
                            unregisterTriggers();
                            removeTooltip();
                        });
                    };
                }
            };
        };
    };
})

.directive('tooltipPopup', function() {
    'ngInject';
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            content: '@',
            placement: '@',
            isOpen: '&'
        },
        templateUrl: 'template/tooltip/tooltip-popup.html'
    };
})

.directive('tooltip', function($tooltip) {
    'ngInject';
    return $tooltip('tooltip', 'tooltip', 'mouseover');
})

.directive('tooltipHtmlUnsafePopup', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            content: '@',
            placement: '@',
            isOpen: '&'
        },
        templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
    };
})

.directive('tooltipHtmlUnsafe', function($tooltip) {
    'ngInject';
    return $tooltip('tooltipHtmlUnsafe', 'tooltip', 'mouseover');
});
