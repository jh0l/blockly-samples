import * as Blockly from 'blockly/core';

class CustomConstantProvider extends Blockly.blockRendering.ConstantProvider {
    constructor() {
        super();

        /**
         * The width of the notch used for previous and next connections.
         * @type {number}
         * @override
         */
        this.NOTCH_WIDTH = 20;

        /**
         * The height of the notch used for previous and next connections.
         * @type {number}
         * @override
         */
        this.NOTCH_HEIGHT = 10;

        /**
         * Rounded corner radius.
         * @type {number}
         * @override
         */
        this.CORNER_RADIUS = 2;

        /**
         * The height of the puzzle tab used for input and output connections.
         * @type {number}
         * @override
         */
        this.TAB_HEIGHT = 8;
    }

    /** @override */
    init() {
        super.init();
        this.RECT_PREV_NEXT = this.makeRectangularPreviousConn();
        this.RECT_INPUT_OUTPUT = this.makeRectangularInputConn();
    }

    // /** @override */
    // shapeFor(connection) {
    //     switch (connection.type) {
    //         case Blockly.INPUT_VALUE:
    //         case Blockly.OUTPUT_VALUE:
    //             return this.RECT_INPUT_OUTPUT;
    //         case Blockly.PREVIOUS_STATEMENT:
    //         case Blockly.NEXT_STATEMENT:
    //             return this.RECT_PREV_NEXT;
    //         default:
    //             throw Error('Unknown type');
    //     }
    // }

    /** @override */
    shapeFor(connection) {
        const checks = connection.getCheck();
        switch (connection.type) {
            case Blockly.INPUT_VALUE:
            case Blockly.OUTPUT_VALUE:
                if (checks && checks.includes('Number')) {
                    return this.RECT_INPUT_OUTPUT;
                }
                if (checks && checks.includes('String')) {
                    return this.RECT_INPUT_OUTPUT;
                }
                return this.PUZZLE_TAB;
            case Blockly.PREVIOUS_STATEMENT:
            case Blockly.NEXT_STATEMENT:
                return this.NOTCH;
            default:
                throw Error('Unknown connection type');
        }
    }

    makeRectangularPreviousConn() {
        const width = this.NOTCH_WIDTH;
        const height = this.NOTCH_HEIGHT;

        // use the same function for generating the 'next' and 'prev' connections
        // @param dir Multi for x axis dir of path (-1 or 1)
        // @returns SVGPath line for use with 'prev' and 'next' connections
        const makeMainPath = (dir) => {
            return Blockly.utils.svgPaths.line([
                Blockly.utils.svgPaths.point(0, height),
                Blockly.utils.svgPaths.point(dir * width, 0),
                Blockly.utils.svgPaths.point(0, -height),
            ]);
        };
        const pathLeft = makeMainPath(1);
        const pathRight = makeMainPath(-1);

        return {
            width,
            height,
            pathLeft,
            pathRight,
        };
    }

    makeRectangularInputConn() {
        const width = this.TAB_WIDTH;
        const height = this.TAB_HEIGHT;

        // use the same function for generating the 'input' and 'output' connections
        // @param dir Multi for y axis dir of path (-1 or 1)
        // @returns SVGPath line for use with 'input' and 'output' connections
        const makeMainPath = (dir) => {
            return Blockly.utils.svgPaths.line([
                Blockly.utils.svgPaths.point(-width, 0),
                Blockly.utils.svgPaths.point(0, dir * height),
                Blockly.utils.svgPaths.point(width, 0),
            ]);
        };

        const pathUp = makeMainPath(-1);
        const pathDown = makeMainPath(1);

        return {
            width,
            height,
            pathUp,
            pathDown,
        };
    }
}

class CustomRenderer extends Blockly.blockRendering.Renderer {
    constructor() {
        super();
    }
    makeConstants_() {
        return new CustomConstantProvider();
    }
}

Blockly.blockRendering.register('custom_renderer', CustomRenderer);
