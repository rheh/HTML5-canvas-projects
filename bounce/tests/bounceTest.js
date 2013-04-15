/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

TestCase('bounceTest', {

    testImageLoaded : function() {
        loadBackground();
        assertTrue(typeof bg !== "undefined");
    }

});
