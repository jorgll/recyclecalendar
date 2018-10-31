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
        <Card transparent>
            <Form>
                <Item stackedLabel>
                    <Label>Home address:</Label>
                    <Input value={this.state.homeAddress} />
                </Item>
            </Form>
            <Button onPress={this.props.onSubmit}>
            <Text>Get Recycling dates</Text>
            </Button>
        </Card>
    );
  }
}

