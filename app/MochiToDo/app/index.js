import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ToDoInput from './input'

const TODOS = [
  {id: 0, content: '当有待办事项存在时，我希望能看到待办事项列表', isDone: true},
  {id: 1, content: '当我输入文字并使用回车确认时，我希望新输入的待办事项项目显示在列表中', isDone: true},
  {id: 2, content: '当我点击待办事项左侧的checkbox时，待办事项应该标示为已完成', isDone: false},
  {id: 3, content: '当我点击已完成待办事项左侧的checkbox时，待办事项应该标示为未完成', isDone: false},
  {id: 4, content: '当我点击待办事项右侧的关闭按钮时，待办事项应当被删除', isDone: false}
];

class ToDo {
  constructor(items = []){
    this.items = items;
    this.listeners = [];
  }
  subscribe(callback){
    const id = this.listeners.length;
    this.listeners.push(callback);
    return ()=>{
      this.listeners.splice(id, 1);
    }
  }
  update(){
    this.listeners.forEach((callback)=>{
      callback(this.items);
    })
  }
  add(content){
    const id = this.items.length;
    this.items.push({
      id: id, content: content, isDone: false
    });
    this.update();
  }
  check(id){
    this.items = this.items.map((item)=>{
      if(item.id !== id) return item;
      return Object.assign({},item, {isDone: !item.isDone});
    });
    this.update();
  }
  remove(id){
    this.items = this.items.filter((item)=>{
      return item.id !== id
    });
    this.update();
  }
}

const toDoData = new ToDo(TODOS);

class ToDoItem extends Component {
  renderCheckbox(checked){
    if(checked) return <View style={[styles.iconContainer, {backgroundColor: 'grey', borderWidth: 1, borderColor: 'black'}]}>
      <Text style={styles.icon}>✔️</Text>
    </View>;
    return <View style={[styles.iconContainer, {backgroundColor: 'white', borderWidth: 1, borderColor: 'black'}]}>
    </View> 
  }
  render() {
    const checked = this.props.checked;
    return <View style={styles.toDoItemContainer}>
      <TouchableOpacity onPress={()=>toDoData.check(this.props.id)}>
        {this.renderCheckbox(checked)}
      </TouchableOpacity>
      <View style={styles.todoItemContent}>
        <Text style={[styles.todoItemContentText, checked && {textDecorationLine: 'line-through'}]}>{this.props.children}</Text>
      </View>
      <TouchableOpacity onPress={()=>toDoData.remove(this.props.id)}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✖️</Text>
        </View>
      </TouchableOpacity>
    </View>
  }
}

class MochiToDo extends Component {
  constructor(){
    super();
    this.state = {
      todos: toDoData.items,
      text: ''
    }
  }
  componentWillMount() {
    this.unusbscribe = toDoData.subscribe((items)=>{
      this.setState({todos: items});
    })
  }
  componentWillUnount() {
    this.unusbscribe();
  }
  onChangeText(text){
    this.setState({text: text});
  }
  onSubmitEditing(){
    if(this.state.text) {
      toDoData.add(this.state.text);
      this.setState({text: ''});
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <ToDoInput
      onChangeText={this.onChangeText.bind(this)}
      onSubmitEditing={this.onSubmitEditing.bind(this)}
      value={this.state.text}
      />
      <ScrollView>
        { this.state.todos.map((todo)=>{
          return <ToDoItem key={todo.id} id={todo.id} checked={todo.isDone}>{todo.content}</ToDoItem>
        }) }
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  toDoItemContainer: {
    flexDirection:'row', 
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'black'
  },
  iconContainer: {
    height: 24, 
    width: 24, 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {fontSize: 12},
  todoItemContent: {flex: 1, paddingHorizontal: 24},
  todoItemContentText: {fontSize: 16}
});

export default module.exports = MochiToDo;