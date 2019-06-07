import React, { Component } from 'react';
import Header from '../Header';
import { Typography, Card, CardContent, CardMedia } from '@material-ui/core';
import FarmaSdk from '../../lib/farmaSDK'
import Loader from 'components/Loader';

class NewsSingle extends Component {
    constructor(props) {
        super(props);
        this.sdk = FarmaSdk.instance()
        this.state = {
            loading: true,
            article: null
        }
    }

    fetchArticle(id) {
        this.setState({ loading: true })
        this.sdk.singleNews(id)
            .then(article => this.setState({ article }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount() {
        this.fetchArticle(Number(this.props.match.params.id))
    }

    formatDate(date){
        date = new Date();
        return date.toLocaleDateString()
    }

    render() {
        const { article } = this.state
        console.log(article)
        return (
            <>
                <Header title="Notícias" backButton />
                <main>
                    {this.state.loading ? <Loader /> :

                        <Card component="article" style={{ maxWidth: 480, margin: '10px auto' }}>

                            {article._embedded['wp:featuredmedia'] &&
                                <CardMedia
                                    style={{ height: 140 }}
                                    title={article._embedded['wp:featuredmedia'][0].title.rendered}
                                    image={article._embedded['wp:featuredmedia'][0].source_url.replace('https', 'http')} />

                            }
                            <CardContent>
                                <time style={{float: 'right'}}>{this.formatDate(article.date)}</time>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {article.title.rendered}
                                </Typography>

                                <Typography component="div"
                                    dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
                            </CardContent>
                        </Card>
                    }
                </main>
            </>
        );
    }
}

export default NewsSingle;