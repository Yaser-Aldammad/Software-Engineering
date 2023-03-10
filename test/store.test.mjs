import assert from 'assert';
import { QuizItem, Quiz } from '../quizbank.mjs'


describe('QuizItem class', () => {



    it("tests the correct() answer", () => {
        let q = new QuizItem("id1", "What is the capital of England?", "London");
        assert.ok(q.correct("London"))
        assert.equal(false, q.correct("Paris"))
    })

    it('tests properties', () => {
        let q = new QuizItem("id1", "What is the capital of England?", "London");
        assert.equal( "London", q.answer );
        assert.equal( "What is the capital of England?", q.question );
        assert.equal( "id1",q.id );
    });

    it('store and fetch', () => {
        let q = new QuizItem("id1", "What is the capital of England?", "London");
        q.store('temp_bank');
        let q2 = QuizItem.fetch("temp_bank","id1");

        assert.equal( q.question, q2.question );
        assert.equal( q.answer, q2.answer );
        assert.equal( q.id, q2.id );

        // attempt cleanup - this is problematic not good cleanup method
        QuizItem.delete('temp_bank', q.id);
    });

    it('delete', () => {
        let q = new QuizItem("id1", "What is the capital of England?", "London");
        q.store('temp_bank');
        let q2 = QuizItem.fetch("temp_bank","id1");

        assert.equal( q.question, q2.question );
        assert.equal( q.answer, q2.answer );
        assert.equal( q.id, q2.id );

        QuizItem.delete('temp_bank', q.id);

        var q3;

        try {
         q3 = QuizItem.fetch("temp_bank","id1");
        } catch(e) {
            return ;
        }
        
        if( ! q3 ) return;

        assert.notEqual( "London", q3.answer );
        assert.notEqual( "What is the capital of England?", q3.question );
        assert.notEqual( "id1",q3.id );
    });
})

describe('Quiz class', () => {

    let q = new Quiz("quizid");

    var items = [
        "q1/What is the capital of France?/Paris",
        "q2/Who is John Gault?/The Fountainhead",
        "q3/What is 110 in binary?/1101110"
    ]

    var QuizItems = [];
    
    beforeEach(() => {
        for( const item of items){
            let v = item.split('/')
            let qi = new QuizItem(v[0], v[1], v[2])
            QuizItems.push(qi)
            q.add(qi)
        }
    })

    it("tests the iterator", () => {
        for(let qi of q){
            assert.ok("q1 q2 q3".includes(qi.id));
        }
    })

    it("tests fetch and store", () => {
        q.store("temp_bank2");
        let q2 = Quiz.fetch("temp_bank2", "quiz_id" );
        for(let qi of q2){
            assert.ok("q1 q2 q3".includes(qi.id));
        }

        // bad way to do cleanup
        Quiz.delete("temp_bank2", "quizid")
    })

    it("tests remove", () => {
        q.remove("q1");
        let qi2;
        for(let qi of q){
            assert.notEqual("q1", qi.id);
            if( qi.id == "q2" )
                qi2 = qi;
        }

        q.remove(qi2);
        for(let qi of q){
            assert.equal("q3", qi.id);
        }
    })

    it("tests delete", () => {
        Quiz.delete("temp_bank2", "quizid")
        var qToo = null;

        try {
           qToo = QuizItem.fetch("temp_bank","id1");
        }
        catch(e){
            return ;
        }
        if( ! qToo ) return;

        for(let qi of qToo){
            assert.fail("Should be empty");
        }
    })


})

