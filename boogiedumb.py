from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Workflow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_email = db.Column(db.String(120), unique=True, nullable=False)
    current_step = db.Column(db.Integer, default=0)
    steps = db.Column(db.String(300), nullable=False)
    
# Creating class for ids, emails, current step and total steps 

# Creating an application context to use for database initialization
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_workflow', methods=['POST'])
def create_workflow():
    data = request.json
    new_workflow = Workflow(candidate_email=data['candidate_email'], steps=','.join(data['steps']))
    db.session.add(new_workflow)
    db.session.commit()
    return jsonify({"message": "Workflow created", "id": new_workflow.id})

@app.route('/trigger_workflow/<int:workflow_id>', methods=['POST'])
def trigger_workflow(workflow_id):
    workflow = Workflow.query.get(workflow_id)
    steps = workflow.steps.split(',')
    if workflow.current_step < len(steps):
        # Send notification to the next employee
        employee_email = steps[workflow.current_step]
        workflow.current_step += 1
        db.session.commit()
        return jsonify({"message": f"Notification sent to {employee_email}"})
    else:
        return jsonify({"message": "Workflow completed"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
