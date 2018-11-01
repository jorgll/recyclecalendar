import React from 'react';
import { 
  Card,
  Form,
  Item,
  Input,
  Label,
  Button, 
  Text,
} from 'native-base';

interface HomeFormProps {
    onSubmit: () => void;
};

interface HomeFormState {
    homeAddress: string;
}

export class HomeForm extends React.Component<HomeFormProps, HomeFormState> {
  constructor(props: any) {
    super(props);
    this.state = { homeAddress: '121 NW 40th St' };
  }

  onButtonPress(): void {
    this.props.onSubmit();
  }

  render() {
    return (
        <Card style={{ minHeight: 180, marginLeft: 20, marginRight: 20, marginTop: 20, padding: 10 }}>
            <Form style={{ paddingBottom: 20 }} >
                <Item stackedLabel>
                    <Label>Home address:</Label>
                    <Input value={this.state.homeAddress} />
                </Item>
            </Form>
            <Button onPress={this.props.onSubmit} style={{ alignSelf: 'center' }}>
            <Text>Get Recycling dates</Text>
            </Button>
        </Card>
    );
  }
}

